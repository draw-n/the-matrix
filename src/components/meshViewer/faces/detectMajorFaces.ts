// Description: find major planar faces on a mesh using convex-hull intersection heuristic.
import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

/**
 * Helper: point-in-triangle using barycentric coordinates.
 * p, a, b, c are Vector3 in same plane.
 */
const pointInTriangle = (
    p: THREE.Vector3,
    a: THREE.Vector3,
    b: THREE.Vector3,
    c: THREE.Vector3
) => {
    // Using barycentric technique
    const v0 = c.clone().sub(a);
    const v1 = b.clone().sub(a);
    const v2 = p.clone().sub(a);

    const dot00 = v0.dot(v0);
    const dot01 = v0.dot(v1);
    const dot02 = v0.dot(v2);
    const dot11 = v1.dot(v1);
    const dot12 = v1.dot(v2);

    const denom = dot00 * dot11 - dot01 * dot01;
    if (Math.abs(denom) < 1e-12) return false;

    const u = (dot11 * dot02 - dot01 * dot12) / denom;
    const v = (dot00 * dot12 - dot01 * dot02) / denom;

    return u >= -1e-8 && v >= -1e-8 && u + v <= 1 + 1e-8;
}


/**
 * detectMajorFaces using convex-hull intersection heuristic:
 * - Build convex hull geometry from mesh vertices (ConvexGeometry)
 * - For each hull triangle, compute plane and test mesh triangle centroids:
 *   if mesh centroid is within plane tolerance and its projection lies inside hull triangle,
 *   add that mesh triangle area to the hull triangle's overlap area.
 * - Cluster hull triangles by similar normals (so planar facets are merged).
 * - Return clusters with averaged normal & centroid (in mesh-local coords) and overlap area.
 */
const detectMajorFaces = (
    geometry: THREE.BufferGeometry,
    options?: {
        planeDistanceTolFactor?: number; // tolerance relative to bbox diag
        normalAngleThreshDeg?: number; // clustering hull triangles into facets
        minOverlapArea?: number; // filter tiny overlaps
    }
) => {
    const opts = {
        planeDistanceTolFactor: 1e-3,
        normalAngleThreshDeg: 3,
        minOverlapArea: 1e-6,
        ...(options || {}),
    };

    const pos = geometry.attributes.position;
    if (!pos) return [];

    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < pos.count; i++) {
        pts.push(new THREE.Vector3().fromBufferAttribute(pos, i));
    }
    if (!pts.length) return [];

    const hullGeom = new ConvexGeometry(pts);

    // Precompute mesh triangle centroids & areas
    const meshFaces: {
        centroid: THREE.Vector3;
        area: number;
        verts: THREE.Vector3[];
    }[] = [];
    const a = new THREE.Vector3(),
        b = new THREE.Vector3(),
        c = new THREE.Vector3();
    const e1 = new THREE.Vector3(),
        e2 = new THREE.Vector3();

    for (let i = 0; i < pos.count; i += 3) {
        a.fromBufferAttribute(pos, i);
        b.fromBufferAttribute(pos, i + 1);
        c.fromBufferAttribute(pos, i + 2);
        e1.subVectors(b, a);
        e2.subVectors(c, a);
        const area = e1.clone().cross(e2).length() * 0.5;
        const centroid = new THREE.Vector3()
            .addVectors(a, b)
            .add(c)
            .divideScalar(3);
        meshFaces.push({
            centroid,
            area,
            verts: [a.clone(), b.clone(), c.clone()],
        });
    }

    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox!;
    const diag = bbox.getSize(new THREE.Vector3()).length();
    const planeTol = Math.max(1e-9, diag * opts.planeDistanceTolFactor);

    const hullPos = hullGeom.attributes.position;
    const hullFaces: {
        a: THREE.Vector3;
        b: THREE.Vector3;
        c: THREE.Vector3;
        centroid: THREE.Vector3;
        normal: THREE.Vector3;
        overlapArea: number;
        contributors: number[]; // indices of meshFaces that contributed to this hull triangle
    }[] = [];

    const ha = new THREE.Vector3(),
        hb = new THREE.Vector3(),
        hc = new THREE.Vector3();
    const he1 = new THREE.Vector3(),
        he2 = new THREE.Vector3(),
        hnormal = new THREE.Vector3();

    for (let i = 0; i < hullPos.count; i += 3) {
        ha.fromBufferAttribute(hullPos, i);
        hb.fromBufferAttribute(hullPos, i + 1);
        hc.fromBufferAttribute(hullPos, i + 2);

        he1.subVectors(hb, ha);
        he2.subVectors(hc, ha);
        hnormal.crossVectors(he1, he2).normalize();

        const hCentroid = new THREE.Vector3()
            .addVectors(ha, hb)
            .add(hc)
            .divideScalar(3);

        let overlap = 0;
        const contributors: number[] = [];
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            hnormal,
            ha
        );
        const proj = new THREE.Vector3();

        for (let j = 0; j < meshFaces.length; j++) {
            const mf = meshFaces[j];
            const dist = plane.distanceToPoint(mf.centroid);
            if (Math.abs(dist) > planeTol) continue;
            plane.projectPoint(mf.centroid, proj);
            if (pointInTriangle(proj, ha, hb, hc)) {
                overlap += mf.area;
                contributors.push(j);
            }
        }

        hullFaces.push({
            a: ha.clone(),
            b: hb.clone(),
            c: hc.clone(),
            centroid: hCentroid.clone(),
            normal: hnormal.clone(),
            overlapArea: overlap,
            contributors,
        });
    }

    // cluster hull triangles by normal
    const clusters: { faces: typeof hullFaces; normal: THREE.Vector3 }[] = [];
    const cosThresh = Math.cos(
        THREE.MathUtils.degToRad(opts.normalAngleThreshDeg)
    );
    for (const hf of hullFaces) {
        let found = false;
        for (const c of clusters) {
            if (c.normal.dot(hf.normal) > cosThresh) {
                c.faces.push(hf);
                const accum = new THREE.Vector3(0, 0, 0);
                let totalArea = 0;
                for (const f of c.faces) {
                    const e1 = f.b.clone().sub(f.a);
                    const e2 = f.c.clone().sub(f.a);
                    const area = e1.cross(e2).length() * 0.5;
                    accum.addScaledVector(f.normal, area);
                    totalArea += area;
                }
                if (totalArea > 0) accum.normalize();
                else accum.copy(c.normal);
                c.normal.copy(accum);
                found = true;
                break;
            }
        }
        if (!found) clusters.push({ faces: [hf], normal: hf.normal.clone() });
    }

    const candidates: {
        normal: THREE.Vector3;
        centroid: THREE.Vector3;
        overlapArea: number;
        bottomVertex: THREE.Vector3;
        ellipseRadii?: [number, number];
    }[] = [];

    for (const c of clusters) {
        let totalOverlap = 0;
        const allVerts: THREE.Vector3[] = [];
        const contributorSet = new Set<number>();

        for (const f of c.faces) {
            const triE1 = f.b.clone().sub(f.a);
            const triE2 = f.c.clone().sub(f.a);
            const triArea = triE1.clone().cross(triE2).length() * 0.5;
            totalOverlap += f.overlapArea;

            allVerts.push(f.a.clone(), f.b.clone(), f.c.clone());

            // collect contributor indices (if any)
            if (
                (f as any).contributors &&
                Array.isArray((f as any).contributors)
            ) {
                for (const idx of (f as any).contributors)
                    contributorSet.add(idx);
            }
        }

        if (totalOverlap < opts.minOverlapArea) continue;

        // Compute a surface centroid from contributor mesh triangle centroids (area-weighted)
        let surfaceCentroid = new THREE.Vector3();
        let surfaceAreaSum = 0;
        if (contributorSet.size > 0) {
            for (const idx of Array.from(contributorSet)) {
                const mf = meshFaces[idx];
                surfaceCentroid.addScaledVector(mf.centroid, mf.area);
                surfaceAreaSum += mf.area;
            }
            if (surfaceAreaSum > 0)
                surfaceCentroid.divideScalar(surfaceAreaSum);
        }

        // fallback: average hull verts projected onto plane
        if (surfaceAreaSum === 0) {
            const avgCentroid = new THREE.Vector3();
            allVerts.forEach((v) => avgCentroid.add(v));
            avgCentroid.divideScalar(allVerts.length || 1);

            const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
                c.normal,
                avgCentroid
            );
            surfaceCentroid = plane.projectPoint(
                avgCentroid,
                new THREE.Vector3()
            );
        }
        // Project all hull vertices onto the plane and compute a 2D bounding box
        // in the plane basis to derive ellipse radii that fit the convex-hull
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            c.normal,
            surfaceCentroid
        );
        const projected = allVerts.map((v) =>
            plane.projectPoint(v.clone(), new THREE.Vector3())
        );

        // Build orthonormal basis (u,v) in the plane
        const arbitrary =
            Math.abs(c.normal.dot(new THREE.Vector3(1, 0, 0))) < 0.9
                ? new THREE.Vector3(1, 0, 0)
                : new THREE.Vector3(0, 1, 0);
        const u = new THREE.Vector3()
            .crossVectors(arbitrary, c.normal)
            .normalize();
        const v2 = new THREE.Vector3().crossVectors(c.normal, u).normalize();

        // compute an in-plane rotation so the ellipse X-axis aligns with u
        const q = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            c.normal.clone().normalize()
        );
        const qX = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
        const qX_proj = qX
            .clone()
            .sub(c.normal.clone().multiplyScalar(qX.dot(c.normal)));
        if (qX_proj.length() > 1e-12) qX_proj.normalize();
        const uNorm = u.clone().normalize();
        const sinTheta = new THREE.Vector3()
            .crossVectors(qX_proj, uNorm)
            .dot(c.normal);
        const cosTheta = qX_proj.dot(uNorm);
        const ellipseRotation = Math.atan2(sinTheta, cosTheta);

        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;
        for (const p of projected) {
            const rel = p.clone().sub(surfaceCentroid);
            const x = rel.dot(u);
            const y = rel.dot(v2);
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }

        const width = maxX - minX || 0;
        const height = maxY - minY || 0;

        // radii for ellipse
        const rx = width * 0.5;
        const ry = height * 0.5;

        // offset markers by a small fixed padding so they don't clip into the mesh.
        // Keep this very small and model-unit agnostic (e.g., mm).
        const FIXED_PADDING = 0.1; // small constant padding (units: model units, default 0.1)
        const offsetDistance = FIXED_PADDING;
        const bottomVertex = surfaceCentroid
            .clone()
            .add(c.normal.clone().normalize().multiplyScalar(offsetDistance));

        candidates.push({
            normal: c.normal.clone().normalize(),
            centroid: surfaceCentroid.clone(),
            overlapArea: totalOverlap,
            bottomVertex,
            ellipseRadii: [rx, ry],
            ellipseRotation,
        } as any);
    }

    candidates.sort((a, b) => b.overlapArea - a.overlapArea);

    return candidates;
};

export default detectMajorFaces;