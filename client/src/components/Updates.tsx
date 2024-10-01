import { Carousel } from "antd";

const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "100vh",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
};

/*interface UpdatesProps {
    height?: string | number | undefined;
    width?: string | number | undefined;
}*/

const Updates = ({}) => {
    const onChange = (currentSlide: number) => {
        console.log(currentSlide);
    };
    return (
        <>
            <Carousel autoplay arrows afterChange={onChange}>
                <div>
                    <h3 style={contentStyle}>Voron 1 is jammed!</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>2</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>3</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>4</h3>
                </div>
            </Carousel>
        </>
    );
};

export default Updates;
