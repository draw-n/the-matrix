import * as THREE from "three";

export const matricesEqual = (m1: THREE.Matrix4 | null, m2: THREE.Matrix4 | null) => {
    if (!m1 || !m2) return false;
    const a = m1.elements;
    const b = m2.elements;
    for (let i = 0; i < 16; i++) {
        if (Math.abs(a[i] - b[i]) > 1e-9) return false;
    }
    return true;
};

export const faceMatches = (a: any, b: any) => {
    if (!a || !b) return false;
    const dist = a.centroid.distanceTo(b.centroid);
    if (dist > 1e-3) return false;
    const cos = a.normal.clone().normalize().dot(b.normal.clone().normalize());
    return cos > Math.cos(THREE.MathUtils.degToRad(5));
};

export const parseFaceData = (f: any) => ({
    normal: new THREE.Vector3(f.normal.x, f.normal.y, f.normal.z),
    centroid: new THREE.Vector3(f.centroid.x, f.centroid.y, f.centroid.z),
    ellipseAxis: f.ellipseAxis
        ? new THREE.Vector3(f.ellipseAxis.x, f.ellipseAxis.y, f.ellipseAxis.z)
        : undefined,
    ellipseCenter: f.ellipseCenter
        ? new THREE.Vector3(
              f.ellipseCenter.x,
              f.ellipseCenter.y,
              f.ellipseCenter.z,
          )
        : new THREE.Vector3(f.centroid.x, f.centroid.y, f.centroid.z),
    ellipseRadii: f.ellipseRadii,
    ellipseRotation: f.ellipseRotation,
});
