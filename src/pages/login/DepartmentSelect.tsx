import { Flex, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { ControlledValueProps } from "../../types/common";
import { useAllDepartments } from "../../hooks/user";

const DepartmentSelect: React.FC<ControlledValueProps<string[]>> = ({
    onChange,
    value,
}) => {
    const { data: departments } = useAllDepartments();
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
