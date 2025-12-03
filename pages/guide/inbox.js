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

  const handleClose = () => {
    setShowChat(false);
    setActiveGuide(null);
  };

  return (
    <>
      <Container className={styles.Container}>
        <h2 style={{ marginBottom: "1.5rem", color: "white" }}>Inbox</h2>

        {Object.keys(messages).length === 0 && (
          <p style={{ color: "#ccc" }}>No messages yet.</p>
        )}

        {Object.keys(messages).map((guide) => {
          const lastMessage = messages[guide][messages[guide].length - 1];
          const guideData = lastMessage.guide;

          return (
            <Card
              key={guide}
              onClick={() => handleOpenChat(guide)}
              className={styles.InboxCard}
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

              <div style={{ flex: 1 }}>
                <h5 style={{ margin: 0, color: "white" }}>{guide}</h5>
                <p style={{ margin: "0.3rem 0", color: "rgba(255,255,255,0.7)" }}>
                  {lastMessage.message.length > 40
                    ? lastMessage.message.slice(0, 40) + "..."
                    : lastMessage.message}
                </p>
                <small style={{ color: "rgba(255,255,255,0.5)" }}>
                  {new Date(lastMessage.timestamp).toLocaleString()}
                </small>
              </div>
            </Card>
          );
        })}
      </Container>

      {/* CHAT MODAL */}
      {activeGuide && (
        <Modal show={showChat} onHide={handleClose} centered size="md">
          <Modal.Header
            closeButton
            style={{
              backgroundColor: "var(--bs-card-color)",
              color: "white",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
            }}
          >
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
              backgroundColor: "#0b1120",
              color: "white",
            }}
          >
            {messages[activeGuide.name]?.map((msg, index) => (
              <div key={index} className={styles.ChatBubble}>
                <p style={{ marginBottom: "0.3rem" }}>{msg.message}</p>
                <small style={{ color: "rgba(255,255,255,0.6)" }}>
                  {new Date(msg.timestamp).toLocaleString()}
                </small>
              </div>
            ))}
          </Modal.Body>

          <Modal.Footer
            style={{
              backgroundColor: "var(--bs-card-color)",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              width: "100%",
            }}
          >
            <FormControl
              placeholder="Type a message…"
              disabled
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />
            <Button
              variant="secondary"
              disabled
              style={{ marginLeft: "0.5rem" }}
            >
              Send
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
