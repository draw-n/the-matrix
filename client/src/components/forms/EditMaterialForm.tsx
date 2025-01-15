import React, { useState } from "react";
import {
    Button,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Flex,
    InputNumber,
    Col,
    Row,
} from "antd";
import axios from "axios";
import { FilamentTemperatures, Material } from "../../types/Material";

interface EditMaterialFormProps {
    material: Material;
    onUpdate: () => void;
}

const { TextArea } = Input;

const EditMaterialForm: React.FC<EditMaterialFormProps> = ({
    material,
    onUpdate,
}: EditMaterialFormProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState(material.name);
    const [shortName, setShortName] = useState(material.shortName);
    const [type, setType] = useState(material.type);
    const [properties, setProperties] = useState(material.properties);
    const [description, setDescription] = useState(material.description);
    const [remotePrintAvailable, setRemotePrintAvailable] = useState(
        material.remotePrintAvailable
    );
    const [temperatures, setTemperatures] = useState<FilamentTemperatures>(
        material.temperatures || {
            extruder: {
                firstLayer: 0,
                otherLayers: 0,
            },
            bed: {
                firstLayer: 0,
                otherLayers: 0,
            },
        }
    );

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            let editedMaterial: Material = {
                _id: material._id,
                name,
                shortName,
                type,
                properties,
                description,
                remotePrintAvailable,
                temperatures
            };
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/materials/${material._id}`,
                editedMaterial
            );
            onUpdate();
        } catch (error) {
            console.error("Issue editing update", error);
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button className="primary-button-filled" onClick={showModal}>
                Edit
            </Button>
            <Modal
                title="Edit Update"
                open={isModalOpen}
                centered
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {JSON.stringify(temperatures)}
                <Form layout="vertical">
                    <Form.Item label="Name">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Item>

                    <Flex gap="10px">
                        <Form.Item
                            style={{ width: "50%" }}
                            label="Short Name"
                           
                        >
                            <Input
                                value={shortName}
                                onChange={(e) => setShortName(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            style={{ width: "50%" }}
                            label="Type"
                         
                        >
                            <Select
                                onChange={setType}
                                value={type}
                                options={[
                                    {
                                        value: "filament",
                                        label: "Filament",
                                    },
                                    { value: "resin", label: "Resin" },
                                    { value: "powder", label: "Powder" },
                                ]}
                            />
                        </Form.Item>
                    </Flex>
                    <Form.Item label="Description">
                        <TextArea
                            rows={6}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Temperatures">
                        <Row gutter={[16, 16]}>
                            <Col span={4}>
                                <p>Extruder</p>
                            </Col>
                            <Col span={10}>
                                <Flex gap="10px" justify="end">
                                    <p>First layer:</p>
                                    <InputNumber
                                        value={
                                            temperatures?.extruder.firstLayer
                                        }
                                        formatter={(value) => `${value} °C`}
                                        parser={(value) =>
                                            value?.replace(
                                                " °C",
                                                ""
                                            ) as unknown as number
                                        }
                                        onChange={(value) =>
                                            setTemperatures({
                                                ...temperatures,
                                                extruder: {
                                                    ...temperatures?.extruder,
                                                    firstLayer: value as number,
                                                },
                                            })
                                        }
                                    />
                                </Flex>
                            </Col>
                            <Col span={10}>
                                <Flex gap="10px" justify="end">
                                    <p>Other layers:</p>
                                    <InputNumber
                                        value={
                                            temperatures.extruder.otherLayers
                                        }
                                        formatter={(value) => `${value} °C`}
                                        parser={(value) =>
                                            value?.replace(
                                                " °C",
                                                ""
                                            ) as unknown as number
                                        }
                                        onChange={(value) =>
                                            setTemperatures({
                                                ...temperatures,
                                                extruder: {
                                                    ...temperatures?.extruder,
                                                    otherLayers:
                                                        value as number,
                                                },
                                            })
                                        }
                                    />
                                </Flex>
                            </Col>
                            <Col span={4}>
                                <p>Bed</p>
                            </Col>
                            <Col span={10}>
                                <Flex gap="10px" justify="end">
                                    <p>First layer:</p>
                                    <InputNumber
                                        value={temperatures.bed.firstLayer}
                                        formatter={(value) => `${value} °C`}
                                        parser={(value) =>
                                            value?.replace(
                                                " °C",
                                                ""
                                            ) as unknown as number
                                        }
                                        onChange={(value) =>
                                            setTemperatures({
                                                ...temperatures,
                                                bed: {
                                                    ...temperatures?.bed,
                                                    firstLayer: value as number,
                                                },
                                            })
                                        }
                                    />
                                </Flex>
                            </Col>
                            <Col span={10}>
                                <Flex gap="10px" justify="end">
                                    <p>Other layers:</p>
                                    <InputNumber
                                        value={temperatures.bed.otherLayers}
                                        formatter={(value) => `${value} °C`}
                                        parser={(value) =>
                                            value?.replace(
                                                " °C",
                                                ""
                                            ) as unknown as number
                                        }
                                        onChange={(value) =>
                                            setTemperatures({
                                                ...temperatures,
                                                bed: {
                                                    ...temperatures?.bed,
                                                    otherLayers:
                                                        value as number,
                                                },
                                            })
                                        }
                                    />
                                </Flex>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label={null}>
                        <Flex gap="10px" align="center">
                            <p>Will it be available for remote printing?</p>

                            <Switch
                                value={remotePrintAvailable}
                                onChange={setRemotePrintAvailable}
                            />
                        </Flex>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditMaterialForm;
