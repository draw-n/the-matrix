// Description: CategoryForm component for adding and editing categories in the settings page.

import {
    ColorPicker,
    Flex,
    Form,
    FormProps,
    Input,
    message,
    Modal,
    Select,
} from "antd";
import { Category, WithCategory } from "../../types/category";
import randomColor from "randomcolor";
import { CommonFormProps } from "../../types/common";
import { editCategoryById, createCategory } from "../../api/category";

interface CategoryFormProps extends CommonFormProps, WithCategory {
    isModalOpen: boolean;
    setIsModalOpen: (item: boolean) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
    category,
    isModalOpen,
    setIsModalOpen,
    onSubmit,
}: CategoryFormProps) => {
    const [form] = Form.useForm();

    const onFinish: FormProps<Category>["onFinish"] = async (values) => {
        if (category) {
            const editedCategory: Category = {
                ...values,
                uuid: category.uuid,
                defaultIssues: category.defaultIssues,
            };
            await editCategoryById(category.uuid, editedCategory);
            message.success("Category successfully updated!");
        } else {
            await createCategory(values);
            message.success("Category successfully created!");
            form.resetFields();
        }
        setIsModalOpen(false);
        onSubmit();
    };

    return (
        <Modal
            onOk={() => form.submit()}
            title={category ? "Edit Category" : "Add Category"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
        >
            <Form
                onFinish={onFinish}
                form={form}
                layout="vertical"
                initialValues={
                    category
                        ? {
                              name: category.name,
                              properties: category.properties,
                              color: category.color,
                          }
                        : {
                              name: "",
                              properties: [],
                              color: randomColor(),
                          }
                }
            >
                <Flex style={{ width: "100%" }} justify="space-between">
                    <Form.Item<Category>
                        style={{ width: "50%" }}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please add a name for the category.",
                            },
                        ]}
                        label="Category Name"
                    >
                        <Input size="small" />
                    </Form.Item>
                    <Form.Item<Category>
                        name="color"
                        label="Color"
                        rules={[
                            {
                                required: true,
                                message: "Please add a color for the category.",
                            },
                        ]}
                    >
                        <ColorPicker
                            size="small"
                            value={form.getFieldValue("color")}
                            onChange={(e) => {
                                form.setFieldsValue({ color: e.toHexString() }); // Ensures color stays as a hex string
                            }}
                            showText
                        />
                    </Form.Item>
                </Flex>

                <Form.Item<Category> name="properties" label="Properties">
                    <Select
                        size="small"
                        mode="multiple"
                        allowClear
                        style={{ width: "100%" }}
                        placeholder="Please select"
                        options={[
                            { value: "temperature", label: "Temperature" },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryForm;
