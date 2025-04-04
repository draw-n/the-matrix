import { Avatar } from "antd";
import randomColor from "randomcolor";

interface AutoAvatarProps {
    children: string;
    seed?: string;
}

const AutoAvatar: React.FC<AutoAvatarProps> = ({
    children,
    seed,
}: AutoAvatarProps) => {
    const getBrightness = (color: string) => {
        // Convert hex to RGB
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);

        // Calculate brightness using a luminance formula
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    // Function to adjust text color based on background color brightness
    const getAdjustedTextColor = (bgColor: string) => {
        const brightness = getBrightness(bgColor);
        return brightness > 128
            ? randomColor({
                  luminosity: "dark",
                  seed: seed || children,
              })
            : "#FFF"; // Black text for light background, white text for dark
    };

    return (
        <Avatar
            style={{
                backgroundColor: randomColor({
                    luminosity: "bright",
                    seed: seed || children,
                }),
                color: getAdjustedTextColor(
                    randomColor({
                        luminosity: "bright",
                        seed: seed || children,
                    })
                ),
                textTransform: "uppercase",
            }}
        >
            {children}
        </Avatar>
    );
};

export default AutoAvatar;
