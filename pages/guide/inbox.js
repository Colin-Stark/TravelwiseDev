import { useEffect, useState } from "react";
import { Container, Card, Modal, Button, FormControl } from "react-bootstrap";
import styles from "@/styles/GuidePage.module.css";

export default function Inbox() {
  const [messages, setMessages] = useState({});
  const [activeGuide, setActiveGuide] = useState(null); 
  const [showChat, setShowChat] = useState(false);

  // Load stored messages
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("guideMessages") || "{}");
    setMessages(stored);
  }, []);

  const handleOpenChat = (guideName) => {
    setActiveGuide(messages[guideName]?.[0]?.guide || null);
    setShowChat(true);
  };

  return (
    <>
      <Container className={styles.Container}>
        <h2 style={{ marginBottom: "1.5rem" }}>Inbox</h2>

        {Object.keys(messages).length === 0 && <p>No messages yet.</p>}

        {Object.keys(messages).map((guide) => {
          const lastMessage = messages[guide][messages[guide].length - 1];
          const guideData = lastMessage.guide;

          return (
            <Card
              key={guide}
              onClick={() => handleOpenChat(guide)}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <img
                src={guideData.ProfileImage}
                alt={guide}
                style={{
                  width: "65px",
                  height: "65px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "1rem",
                }}
              />

              {/* GUIDE NAME + LAST MESSAGE */}
              <div style={{ flex: 1 }}>
                <h5 style={{ margin: 0 }}>{guide}</h5>
                <p style={{ margin: "0.3rem 0", color: "#666" }}>
                  {lastMessage.message.length > 40
                    ? lastMessage.message.slice(0, 40) + "..."
                    : lastMessage.message}
                </p>
                <small>{new Date(lastMessage.timestamp).toLocaleString()}</small>
              </div>
            </Card>
          );
        })}
      </Container>

      {/* ================= CHAT MODAL ================= */}
      {activeGuide && (
        <Modal show={showChat} onHide={() => setShowChat(false)} centered size="md">
          <Modal.Header closeButton>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={activeGuide.ProfileImage}
                alt={activeGuide.name}
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "1rem",
                }}
              />
              <h4 style={{ margin: 0 }}>{activeGuide.name}</h4>
            </div>
          </Modal.Header>

          <Modal.Body
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              padding: "1rem",
              background: "#f7f7f7",
            }}
          >
            {messages[activeGuide.name]?.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "1rem",
                  background: "#fff",
                  padding: "0.8rem",
                  borderRadius: "8px",
                }}
              >
                <p style={{ marginBottom: "0.3rem" }}>{msg.message}</p>
                <small style={{ color: "#777" }}>
                  {new Date(msg.timestamp).toLocaleString()}
                </small>
              </div>
            ))}
          </Modal.Body>

          <Modal.Footer style={{ display: "flex", width: "100%" }}>
            <FormControl placeholder="Type a message…" disabled />
            <Button variant="secondary" disabled style={{ marginLeft: "0.5rem" }}>
              Send
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
