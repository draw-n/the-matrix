import { Input, Tag } from "antd";
import { useState } from "react";

interface MultiTypeProps {
    value?: string[];
    onChange?: (value: string[]) => void;
}

const MultiType: React.FC<MultiTypeProps> = ({ value, onChange, ...rest }) => {
    const [inputValue, setInputValue] = useState<string>("");

    // Handle input change
    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    // Handle input keydown event
    const handleKeyDown = (e: any) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const trimmedValue = inputValue.trim();
            if (trimmedValue && !value?.includes(trimmedValue)) {
                const newValue = [...(value ?? []), trimmedValue];
                if (onChange) {
                    onChange(newValue);
                }
                setInputValue("");
            }
        }
    };

    // Handle tag deletion
    const handleDeleteTag = (tagToDelete: any) => {
        const newValue = (value ?? []).filter((tag) => tag !== tagToDelete);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <>
            <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type and press Enter or comma to add tags"
                style={{ width: "100%" }}
                {...rest}
            />

            {(value ?? []).map((tag, index) => (
                <Tag
                    key={index}
                    closable
                    onClose={() => handleDeleteTag(tag)}
                    style={{ margin: 4 }}
                >
                    {tag}
                </Tag>
            ))}
        </>
    );
};

export default MultiType;
