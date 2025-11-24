import { Flex, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { ControlledValueProps } from "../../types/common";

const DepartmentSelect: React.FC<ControlledValueProps<string[]>> = ({
    onChange,
    value,
}) => {
    const [departments, setDepartments] = useState<string[]>([]);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get<string[]>(
                    `${import.meta.env.VITE_BACKEND_URL}/users/departments`
                );
                setDepartments(response.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        fetchDepartments();
    }, []);
    return (
        <Flex gap="large" vertical align="center" justify="center">
            <p>Select the department(s)/major(s) you are affiliated with.</p>

            <Select
                mode="multiple"
                value={value}
                onChange={onChange}
                style={{ width: "100%" }}
                options={departments?.map((dept) => ({
                    value: dept,
                    label: dept,
                }))}
            />
        </Flex>
    );
};

export default DepartmentSelect;
