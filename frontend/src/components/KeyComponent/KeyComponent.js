/**
 * @module Components
 */
import "./KeyComponent.css";

/**
 * Key Component
 * 
 * This component is a key with a description for the ControlMenu component.
 * 
 * @param {Object} props - The props of the component.
 * @param {string} props.keyValue - The key value.
 * @param {string} props.description - The description of the key.
 * 
 * @returns {JSX.Element} The KeyComponent component
 */

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