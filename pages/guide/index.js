import { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Dropdown,
  Modal,
  FormControl,
} from "react-bootstrap";
import styles from "@/styles/GuidePage.module.css";
import GuideCard from "@/components/Guide/GuideCard";

export default function Messages() {
  const [countries, setCountries] = useState([]);
  const [draftSearch, setDraftSearch] = useState("");
  const [draftCategory, setDraftCategory] = useState("");
  const [draftCountry, setDraftCountry] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    category: "",
    country: "",
  });

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [activeGuide, setActiveGuide] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const text = await fetch("/data/countries_iso3166b.csv").then((r) =>
          r.text()
        );
        const lines = text.trim().split("\n").slice(1);

        const parsed = lines
          .map((line) => line.split(",")[4] || line.split(",")[3])
          .filter(Boolean);

        setCountries(parsed);
      } catch (err) {
        console.error("Error loading countries", err);
      }
    };

    loadCountries();
  }, []);

  /** Dummy Profile Data */
  const GuideProfile = [
    {
      name: "Adam",
      ProfileImage: "/images/adam.jpg",
      Category: "Family-Friendly",
      country: "Canada",
      description: "I'm Adam, a friendly Toronto guide with 5 years experience.",
    },
    {
      name: "Micheal",
      ProfileImage: "/images/micheal.jpeg",
      Category: "Walking Tours",
      country: "United States",
      description: "I specialize in immersive walking tours.",
    },
    {
      name: "Sarah",
      ProfileImage: "/images/sarah.jpg",
      Category: "Historical Tours",
      country: "Ireland",
      description: "I offer deep historical insights.",
    },
    {
      name: "Nike",
      ProfileImage: "/images/nike.jpg",
      Category: "Food Tours",
      country: "Nigeria",
      description: "I highlight cultural flavors & authentic eateries.",
    },
    {
      name: "Adam",
      ProfileImage: "/images/adam-night.jpg",
      Category: "Nightlife Guides",
      country: "United Kingdom",
      description: "I guide visitors through vibrant nightlife.",
    },
    {
      name: "Micheal",
      ProfileImage: "/images/michael-outdoor.jpg",
      Category: "Outdoor Adventures",
      country: "Australia",
      description: "I lead refreshing outdoor experiences.",
    },
    {
      name: "Sarah",
      ProfileImage: "/images/sarah-gems.jpg",
      Category: "Hidden Gems",
      country: "Japan",
      description: "I uncover unique hidden gems.",
    },
    {
      name: "Nike",
      ProfileImage: "/images/nike-local.jpg",
      Category: "Local Experiences",
      country: "Brazil",
      description: "I create meaningful local experiences.",
    },
  ];

  const categories = [
    "Walking Tours",
    "Local Experiences",
    "Historical Tours",
    "Food Tours",
    "Nightlife Guides",
    "Outdoor Adventures",
    "Hidden Gems",
    "Family-Friendly",
  ];

  const filteredGuides = GuideProfile.filter((g) => {
    const s = activeFilters.search.toLowerCase();
    const matchSearch =
      !s ||
      g.name.toLowerCase().includes(s) ||
      g.description.toLowerCase().includes(s) ||
      g.Category.toLowerCase().includes(s);

    const matchCategory =
      !activeFilters.category || g.Category === activeFilters.category;

    const matchCountry =
      !activeFilters.country || g.country === activeFilters.country;

    return matchSearch && matchCategory && matchCountry;
  });

  const rows = [];
  for (let i = 0; i < filteredGuides.length; i += 3) {
    rows.push(filteredGuides.slice(i, i + 3));
  }

  const applyFilters = (e) => {
    e.preventDefault();
    setActiveFilters({
      search: draftSearch.trim(),
      category: draftCategory,
      country: draftCountry,
    });
  };

  const resetFilters = () => {
    setDraftSearch("");
    setDraftCategory("");
    setDraftCountry("");
    setActiveFilters({ search: "", category: "", country: "" });
  };

  const openGuideModal = (guide) => {
    setActiveGuide(guide);
    setMessageInput("");
    setShowModal(true);
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const inbox = JSON.parse(localStorage.getItem("guideMessages") || "{}");

    if (!inbox[activeGuide.name]) inbox[activeGuide.name] = [];

    inbox[activeGuide.name].push({
      message: messageInput.trim(),
      timestamp: new Date().toISOString(),
      guide: activeGuide,
    });

    localStorage.setItem("guideMessages", JSON.stringify(inbox));

    alert("Message Sent!");
    setShowModal(false);
  };

  return (
    <>
      <div className={styles.Container}>
        <Form className={styles.FormStyle} onSubmit={applyFilters}>
          <input
            type="text"
            placeholder="Search For Guide"
            style={{ width: "40%", marginRight: "1rem" }}
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
          />

          <Dropdown className={styles.dropDown}>
            <Dropdown.Toggle
              variant={draftCategory ? "primary" : "outline-primary"}
            >
              {draftCategory || "Category"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {categories.map((cat) => (
                <Dropdown.Item key={cat} onClick={() => setDraftCategory(cat)}>
                  {draftCategory === cat ? "✓ " : ""}
                  {cat}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className={styles.dropDown}>
            <Dropdown.Toggle
              variant={draftCountry ? "primary" : "outline-primary"}
            >
              {draftCountry || "Country"}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ maxHeight: "250px", overflowY: "auto" }}>
              {countries.map((c) => (
                <Dropdown.Item key={c} onClick={() => setDraftCountry(c)}>
                  {draftCountry === c ? "✓ " : ""}
                  {c}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Button variant="primary" type="submit" className={styles.submit}>
            Apply Filters
          </Button>

          <Button
            variant="secondary"
            type="button"
            style={{ marginLeft: "0.5rem" }}
            onClick={resetFilters}
          >
            Reset
          </Button>
        </Form>

        {/* CARD GRID */}
        <Container className={styles.CardContainer}>
          {rows.map((row, i) => (
            <div className={styles.Row} key={i}>
              {row.map((guide, j) => (
                <div
                  className={styles.CardWrapper}
                  key={j}
                  onClick={() => openGuideModal(guide)}
                >
                  <GuideCard {...guide} />
                </div>
              ))}
            </div>
          ))}
        </Container>
      </div>

      {/* GUIDE MODAL */}
      {activeGuide && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header
            closeButton
            style={{
              backgroundColor: "var(--bs-card-color)",
              color: "white",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Modal.Title>{activeGuide.name}</Modal.Title>
          </Modal.Header>

          <Modal.Body
            style={{
              backgroundColor: "#0b1120",
              color: "white",
            }}
          >
            <img
              src={activeGuide.ProfileImage}
              alt={activeGuide.name}
              style={{
                width: "100%",
                borderRadius: "10px",
                marginBottom: "1rem",
              }}
            />

            <h5>{activeGuide.Category}</h5>
            <p>
              <strong>Country:</strong> {activeGuide.country}
            </p>
            <p>{activeGuide.description}</p>

            <FormControl
              as="textarea"
              rows={3}
              placeholder="Write your message…"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              style={{
                marginTop: "1rem",
                backgroundColor: "rgba(255,255,255,0.05)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />
          </Modal.Body>

          <Modal.Footer
            style={{
              backgroundColor: "var(--bs-card-color)",
              borderTop: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Button variant="success" onClick={sendMessage}>
              Send Message
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}