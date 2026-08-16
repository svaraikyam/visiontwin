export default function Sidebar() {
    return (
        <div
            style={{
                borderRight: "1px solid #ccc",
                padding: 10,
                overflow: "auto",
            }}
        >
            <h3>Assets</h3>

            <ul>
                <li>Floor</li>
                <li>Camera</li>
                <li>Light</li>
            </ul>
        </div>
    );
}