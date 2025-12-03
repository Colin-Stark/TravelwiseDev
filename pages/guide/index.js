import { useEffect, useState } from "react";
import { Form, Button, Container, Dropdown, Modal, FormControl } from "react-bootstrap";
import styles from "@/styles/GuidePage.module.css";
import GuideCard from "@/components/Guide/GuideCard";

export default function Messages() {
  const [countries, setCountries] = useState([]);

  const [draftSearch, setDraftSearch] = useState("");
  const [draftCategory, setDraftCategory] = useState("");
  const [draftCountry, setDraftCountry] = useState("");

  // Active filters applied
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    category: "",
    country: "",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [activeGuide, setActiveGuide] = useState(null);

  // New message input inside modal
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const text = await fetch("/data/countries_iso3166b.csv").then((r) => r.text());
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

  /** DUMMY DATA */
  const GuideProfile = [
    {
      name: "Adam",
      ProfileImage: "/images/adam.jpg",
      Category: "Family-Friendly",
      country: "Canada",
      description: "I'm Adam, a friendly Toronto guide with 5 years of experience.",
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
    const search = activeFilters.search.toLowerCase();

    const matchesSearch =
      !search ||
      g.name.toLowerCase().includes(search) ||
      g.description.toLowerCase().includes(search) ||
      g.Category.toLowerCase().includes(search);

    const matchesCategory = !activeFilters.category || g.Category === activeFilters.category;

    const matchesCountry = !activeFilters.country || g.country === activeFilters.country;

    return matchesSearch && matchesCategory && matchesCountry;
  });

  const rows = [];
  for (let i = 0; i < filteredGuides.length; i += 3) {
    rows.push(filteredGuides.slice(i, i + 3));
  }

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setActiveFilters({
      search: draftSearch.trim(),
      category: draftCategory,
      country: draftCountry,
    });
  };

  const handleResetFilters = () => {
    setDraftSearch("");
    setDraftCategory("");
    setDraftCountry("");

    setActiveFilters({
      search: "",
      category: "",
      country: "",
    });
  };

  const handleCardClick = (guide) => {
    setActiveGuide(guide);
    setMessageInput("");
    setShowModal(true);
  };

  const handleSendMessage = () => {
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

    setMessageInput("");
    setShowModal(false);
  };

  return (
    <>
      <div className={styles.Container}>
        <Form className={styles.FormStyle} onSubmit={handleApplyFilters}>
          <input
            type="text"
            placeholder="Search For Guide"
            style={{ width: "40%", marginRight: "1rem" }}
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
          />

          <Dropdown className={styles.dropDown}>
            <Dropdown.Toggle variant={draftCategory ? "primary" : "outline-primary"}>
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
            <Dropdown.Toggle variant={draftCountry ? "primary" : "outline-primary"}>
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

          <Button variant="secondary" type="button" style={{ marginLeft: "0.5rem" }} onClick={handleResetFilters}>
            Reset
          </Button>
        </Form>

        {/* CARD GRID */}
        <Container className={styles.CardContainer}>
          {rows.map((row, rowIndex) => (
            <div className={styles.Row} key={rowIndex}>
              {row.map((guide, cardIndex) => (
                <div className={styles.CardWrapper} key={cardIndex} onClick={() => handleCardClick(guide)}>
                  <GuideCard {...guide} />
                </div>
              ))}
            </div>
          ))}
        </Container>
      </div>

      {/* MODAL */}
      {activeGuide && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{activeGuide.name}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <img
              src={activeGuide.ProfileImage}
              alt={activeGuide.name}
              style={{ width: "100%", borderRadius: "10px", marginBottom: "1rem" }}
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
              style={{ marginTop: "1rem" }}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="success" onClick={handleSendMessage}>
              Send Message
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}