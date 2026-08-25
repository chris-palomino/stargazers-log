const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");
const status = document.querySelector("#status");

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(`${date}T00:00:00`));
}

function formatStars(stars) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(stars);
}

function createRepositoryItem(event) {
  const item = document.createElement("li");
  item.className = "repository-item";

  const link = document.createElement("a");
  link.className = "repository-link";
  link.href = event.repository.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = event.repository.name;

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = event.repository.description;

  const metadata = document.createElement("p");
  metadata.className = "repository-meta";
  const language = document.createElement("span");
  language.textContent = event.repository.language;

  const stars = document.createElement("span");
  stars.textContent = `${formatStars(event.repository.stars)} stars`;

  const starredDate = document.createElement("span");
  starredDate.textContent = `Starred ${formatDate(event.starredAt)}`;

  metadata.append(language, stars, starredDate);

  item.append(link, description, metadata);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const events = await response.json();
    repositoryList.replaceChildren(...events.map(createRepositoryItem));
    repositoryCount.textContent = `${events.length} repositories`;
    status.remove();
  } catch (error) {
    status.className = "status error";
    status.textContent = "Unable to load starred repositories right now.";
    console.error(error);
  }
}

loadRepositories();