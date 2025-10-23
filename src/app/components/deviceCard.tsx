import { useState } from "react";
import { ZigbeeDevice } from "../types/device";

interface ZigbeeDeviceCardProps {
device: ZigbeeDevice;
}

export const ZigbeeDeviceCard: React.FC<ZigbeeDeviceCardProps> = ({ device }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
        style={{
        border: "1px solid #e0e0e0",
        borderRadius: 12,
        padding: 16,
        margin: 12,
        maxWidth: 400,
        background: "#fafafa",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
        >
        <div style={{ display: "flex", justifyContent: "space-between" }}> <div>
        <h3 style={{ margin: 0 }}>{device.friendly_name}</h3>
        <p style={{ margin: "4px 0", color: "#666" }}>
        {device.definition?.vendor ?? device.manufacturer} —{" "}
        {device.definition?.model ?? device.model_id} </p>
        <p style={{ fontSize: 12, color: "#999" }}>{device.ieee_address}</p> </div>
        <div style={{ textAlign: "right" }}>
        <span
        style={{
        fontSize: 12,
        color: device.supported ? "#2e7d32" : "#d32f2f",
        }}
        >
        {device.supported ? "Supported" : "Unsupported"} </span> <br />
        <span style={{ fontSize: 12, color: "#999" }}>{device.type}</span> </div> </div>

        {device.definition?.description && (
            <p style={{ marginTop: 8, fontSize: 14, color: "#555" }}>
            {device.definition.description}
            </p>
        )}

        {device.definition?.exposes?.length ? (
            <button
            style={{
                marginTop: 8,
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
                fontSize: 14,
            }}
            onClick={() => setExpanded((v) => !v)}
            >
            {expanded ? "Hide Features" : "Show Features"}
            </button>
        ) : null}

        {expanded && device.definition?.exposes?.length ? (
            <ul style={{ marginTop: 10, paddingLeft: 20 }}>
            {device.definition.exposes.map((feature) => (
                <li key={feature.name}>
                <strong>{feature.name}</strong> ({feature.type})
                {feature.features && feature.features.length > 0 && (
                    <ul style={{ paddingLeft: 20 }}>
                    {feature.features.map((f) => (
                        <li key={f.name}>
                        {f.name} {f.unit ? `(${f.unit})` : ""}
                        {f.description ? ` — ${f.description}` : ""}
                        </li>
                    ))}
                    </ul>
                )}
                </li>
            ))}
            </ul>
        ) : null}
        </div>
    );
};
