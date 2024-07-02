import "./KeyComponent.css";

function KeyComponent({ keyValue, description}) {
    return (
        <div className="key-component">
            <div className="key-container">
                {keyValue}
            </div>
            <div className="description-container">
                <p>{description}</p>
            </div>
        </div>
    )
}

export default KeyComponent;