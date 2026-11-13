"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  CreditCard,
  Heart,
  LayoutDashboard,
  List,
  MapPin,
  Menu,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Users,
  Wrench,
  X,
  Grid2X2,
} from "lucide-react";
import {
  initialMaintenance,
  initialPayments,
  initialProperties,
  money,
  type Property,
} from "@/lib/demo-data";
import PropertyCard from "./property-card";
import WorkspaceDialog from "./workspace-dialog";
import ThemeToggle from "./theme-toggle";
import {
  ActivityPanel,
  CollectionChart,
  PortfolioStats,
} from "./overview-panels";

type View =
  | "Overview"
  | "Properties"
  | "Tenants"
  | "Payments"
  | "Maintenance"
  | "Settings"
  | "Explore homes"
  | "Saved homes"
  | "My viewings";
type Viewing = { property: string; date: string; time: string };
const managerNav = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Properties", icon: Building2 },
  { label: "Tenants", icon: Users },
  { label: "Payments", icon: CreditCard },
  { label: "Maintenance", icon: Wrench },
] as const;
const renterNav = [
  { label: "Explore homes", icon: Search },
  { label: "Saved homes", icon: Heart },
  { label: "My viewings", icon: CalendarDays },
] as const;

export default function RentalWorkspace() {
  const [profile, setProfile] = useState({
    name: "Jordan Davis",
    email: "jordan@example.com",
    workspace: "Forme Living",
    digest: "weekly",
  });
  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const [mode, setMode] = useState<"manage" | "explore">("manage");
  const [view, setView] = useState<View>("Overview");
  const [properties, setProperties] = useState(initialProperties);
  const [payments, setPayments] = useState(initialPayments);
  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All properties");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [mobileNav, setMobileNav] = useState(false);
  const [dialog, setDialog] = useState<"add" | "help" | "request" | null>(null);
  const [selected, setSelected] = useState<Property | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [viewings, setViewings] = useState<Viewing[]>([]);
  const [booking, setBooking] = useState(false);
  const [notice, setNotice] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [maxRent, setMaxRent] = useState("any");
  const [minBeds, setMinBeds] = useState("any");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timeout);
  }, [notice]);

  function navigate(next: View) {
    setView(next);
    setQuery("");
    setFilter("All properties");
    setMobileNav(false);
    setNotifications(false);
  }
  function switchMode(next: "manage" | "explore") {
    setMode(next);
    navigate(next === "manage" ? "Overview" : "Explore homes");
  }
  function closeProperty() {
    setSelected(null);
    setBooking(false);
  }
  function addProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const property: Property = {
      id: `FM-${String(properties.length + 1).padStart(3, "0")}`,
      name: String(form.get("name")).trim(),
      address: String(form.get("address")).trim(),
      neighborhood: String(form.get("neighborhood")).trim(),
      rent: Number(form.get("rent")),
      beds: Number(form.get("beds")),
      baths: Number(form.get("baths")),
      area: Number(form.get("area")),
      image: "park",
      status: "Available",
      tenant: null,
    };
    setProperties([...properties, property]);
    setDialog(null);
    navigate("Properties");
    setNotice(`${property.name} added to your demo portfolio.`);
  }
  function exportPortfolio() {
    const cell = (value: string | number) => {
      const text = String(value);
      // Spreadsheet apps interpret formula prefixes even inside quoted CSV cells.
      const safeText =
        typeof value === "string" && /^[=+\-@\t\r]/.test(text)
          ? `'${text}`
          : text;
      return `"${safeText.replace(/"/g, '""')}"`;
    };
    const rows = [
      ["Property", "Address", "Status", "Monthly rent", "Tenant"],
      ...properties.map((property) => [
        property.name,
        property.address,
        property.status,
        property.rent,
        property.tenant ?? "",
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob([rows.map((row) => row.map(cell).join(",")).join("\r\n")], {
        type: "text/csv;charset=utf-8;",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "forme-portfolio.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Your portfolio has been exported.");
  }

  const renter = mode === "explore";
  const openRequests = maintenance.filter((item) => !item.completed).length;
  const filteredProperties = properties.filter((property) => {
    const matchesQuery =
      `${property.name} ${property.address} ${property.neighborhood}`
        .toLowerCase()
        .includes(query.toLowerCase());
    const matchesStatus =
      filter === "All properties" || property.status === filter;
    const matchesRenter =
      !renter ||
      (property.status === "Available" &&
        (view !== "Saved homes" || saved.includes(property.id)) &&
        (maxRent === "any" || property.rent <= Number(maxRent)) &&
        (minBeds === "any" || property.beds >= Number(minBeds)));
    return matchesQuery && matchesStatus && matchesRenter;
  });
  const propertyView = [
    "Overview",
    "Properties",
    "Explore homes",
    "Saved homes",
  ].includes(view);
  const heading =
    view === "Overview" ? (
      <>
        EVERY HOME.
        <br />
        <span>IN ORDER.</span>
      </>
    ) : view === "Explore homes" ? (
      <>
        FIND YOUR
        <br />
        <span>NEXT CHAPTER.</span>
      </>
    ) : view === "Properties" ? (
      <>
        YOUR HOMES.
        <br />
        <span>ALL HERE.</span>
      </>
    ) : (
      <>
        {view.toUpperCase()}
        <span className="red">.</span>
      </>
    );

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {mobileNav && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <Link href="/" className="brand" aria-label="FORME home">
          <span className="brand-symbol" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          FORME<span className="brand-registered">®</span>
        </Link>
        <div className="workspace-label micro">RENTAL SPACE. SIMPLIFIED.</div>
        <div className="workspace-switch">
          <div className="workspace-avatar">F.</div>
          <div>
            <strong>{profile.workspace}</strong>
            <span className="micro">PERSONAL WORKSPACE</span>
          </div>
          <ChevronDown size={14} />
        </div>
        <div className="mode-switch" aria-label="Workspace mode">
          <button
            className={!renter ? "active" : ""}
            onClick={() => switchMode("manage")}
          >
            MANAGE
          </button>
          <button
            className={renter ? "active" : ""}
            onClick={() => switchMode("explore")}
          >
            EXPLORE <ArrowUpRight size={11} />
          </button>
        </div>
        <div className="nav-label micro">
          {renter ? "FIND YOUR PLACE" : "WORKSPACE"}
        </div>
        <nav aria-label="Main navigation">
          {(renter ? renterNav : managerNav).map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${view === label ? "active" : ""}`}
              onClick={() => navigate(label)}
              aria-current={view === label ? "page" : undefined}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Properties" && (
                <span className="nav-count">
                  {String(properties.length).padStart(2, "0")}
                </span>
              )}
              {label === "Maintenance" && openRequests > 0 && (
                <span className="nav-count red-count">
                  {String(openRequests).padStart(2, "0")}
                </span>
              )}
              {label === "Saved homes" && saved.length > 0 && (
                <span className="nav-count">{saved.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="crosshair">+</span>
            <p>
              Good spaces.
              <br />
              Better living.
            </p>
            <div className="barcode" aria-hidden="true" />
            <span className="micro">BUILT AROUND HOME.</span>
          </div>
          <button
            className={`nav-item ${view === "Settings" ? "active" : ""}`}
            onClick={() => navigate("Settings")}
          >
            <Settings2 size={18} />
            Settings
          </button>
          <button className="nav-item" onClick={() => setDialog("help")}>
            <CircleHelp size={18} />
            Help & resources
            <ArrowUpRight size={13} className="ml-auto" />
          </button>
          <div className="user-profile">
            <span className="user-avatar">{initials}</span>
            <div>
              <strong>{profile.name}</strong>
              <span className="micro">
                {renter ? "FINDING A HOME" : "PROPERTY MANAGER"}
              </span>
            </div>
            <span className="profile-online" />
          </div>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="flex items-center gap-3">
            <button
              className="mobile-menu icon-button"
              onClick={() => setMobileNav(!mobileNav)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <span className="micro topbar-workspace">WORKSPACE</span>
            <span className="breadcrumb-slash">/</span>
            <span className="micro">{view.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="demo-indicator micro">
              <span /> DEMO WORKSPACE
            </span>
            <ThemeToggle />
            <div className="notification-wrap">
              <button
                className="notification-button icon-button"
                aria-label="Notifications"
                aria-expanded={notifications}
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={18} />
                <span />
              </button>
              {notifications && (
                <div className="notification-popover">
                  <h3>YOU’RE IN THE LOOP.</h3>
                  <p>
                    {payments.some((payment) => payment.status === "Overdue")
                      ? "Jamie Chen’s November rent is overdue."
                      : "You’re all caught up on November rent."}
                  </p>
                  <p>{openRequests} maintenance requests need a look.</p>
                  <button
                    className="text-link"
                    onClick={() => {
                      switchMode("manage");
                      navigate("Payments");
                    }}
                  >
                    REVIEW PAYMENTS <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
            <span className="topbar-avatar">{initials}</span>
          </div>
        </header>
        <main id="main-content" className="main-content">
          <section
            className={`page-heading ${view !== "Overview" && view !== "Properties" && view !== "Explore homes" ? "compact-heading" : ""}`}
          >
            <div>
              <h1>{heading}</h1>
              <p>
                {view === "Overview"
                  ? "A little clarity for the places you care for."
                  : renter
                    ? "Well-considered homes. Room for what’s next."
                    : "Less admin. More room for what matters."}
              </p>
            </div>
            <div className="heading-actions">
              <span className="date-stamp micro">
                <CalendarDays size={14} /> WEDNESDAY, NOV 11, 2026
              </span>
              {renter ? (
                <div className="location-stamp">
                  <MapPin size={16} /> LOS ANGELES, CA
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    className="button button-secondary"
                    onClick={exportPortfolio}
                    aria-label="Export portfolio"
                  >
                    <ArrowDownToLine size={15} />
                    <span>EXPORT</span>
                  </button>
                  <button
                    className="button button-primary"
                    onClick={() => setDialog("add")}
                  >
                    <Plus size={17} />
                    ADD PROPERTY
                  </button>
                </div>
              )}
            </div>
          </section>

          {view === "Overview" && (
            <PortfolioStats
              properties={properties}
              payments={payments}
              maintenance={maintenance}
            />
          )}

          {propertyView && (
            <div className={view === "Overview" ? "overview-body" : ""}>
              <div className="portfolio-content">
                <div className="section-heading">
                  <div className="flex items-center gap-3">
                    <h2>
                      {view === "Overview"
                        ? "YOUR PORTFOLIO"
                        : view === "Saved homes"
                          ? "SAVED FOR LATER"
                          : renter
                            ? "A PLACE TO CALL YOURS"
                            : "PROPERTY DIRECTORY"}
                    </h2>
                    <span className="count-box micro">
                      {String(filteredProperties.length).padStart(2, "0")}
                    </span>
                  </div>
                  {view === "Overview" ? (
                    <button
                      className="text-link"
                      onClick={() => navigate("Properties")}
                    >
                      ALL PROPERTIES <ArrowUpRight size={14} />
                    </button>
                  ) : (
                    <span className="micro muted">
                      {filteredProperties.length} HOMES
                    </span>
                  )}
                </div>
                <div className="property-toolbar">
                  <div className="filter-tabs" aria-label="Property status">
                    {(renter
                      ? ["Available"]
                      : ["All properties", "Occupied", "Available"]
                    ).map((status) => (
                      <button
                        className={renter || filter === status ? "active" : ""}
                        key={status}
                        onClick={() => setFilter(status)}
                        aria-pressed={renter || filter === status}
                      >
                        {status}
                        {!renter && (
                          <span>
                            {status === "All properties"
                              ? properties.length
                              : properties.filter((p) => p.status === status)
                                  .length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="toolbar-tools">
                    <label className="search-field">
                      <Search size={15} />
                      <input
                        aria-label="Search properties"
                        placeholder="Search properties..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      {query && (
                        <button
                          onClick={() => setQuery("")}
                          aria-label="Clear search"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </label>
                    {renter && (
                      <button
                        className={`icon-button ${showFilters ? "selected" : ""}`}
                        onClick={() => setShowFilters(!showFilters)}
                        aria-expanded={showFilters}
                        aria-label="Filter homes"
                      >
                        <SlidersHorizontal size={16} />
                      </button>
                    )}
                    <div className="view-toggle">
                      <button
                        aria-label="Grid view"
                        aria-pressed={layout === "grid"}
                        className={layout === "grid" ? "selected" : ""}
                        onClick={() => setLayout("grid")}
                      >
                        <Grid2X2 size={15} />
                      </button>
                      <button
                        aria-label="List view"
                        aria-pressed={layout === "list"}
                        className={layout === "list" ? "selected" : ""}
                        onClick={() => setLayout("list")}
                      >
                        <List size={17} />
                      </button>
                    </div>
                  </div>
                </div>
                {renter && showFilters && (
                  <div className="renter-filters">
                    <label>
                      MAXIMUM MONTHLY RENT
                      <select
                        value={maxRent}
                        onChange={(event) => setMaxRent(event.target.value)}
                      >
                        <option value="any">Any price</option>
                        <option value="3000">Up to $3,000</option>
                        <option value="3500">Up to $3,500</option>
                        <option value="4000">Up to $4,000</option>
                      </select>
                    </label>
                    <label>
                      BEDROOMS
                      <select
                        value={minBeds}
                        onChange={(event) => setMinBeds(event.target.value)}
                      >
                        <option value="any">Any size</option>
                        <option value="2">2+ bedrooms</option>
                        <option value="3">3+ bedrooms</option>
                        <option value="4">4+ bedrooms</option>
                      </select>
                    </label>
                    <button
                      className="text-link"
                      onClick={() => {
                        setMaxRent("any");
                        setMinBeds("any");
                      }}
                    >
                      RESET FILTERS <X size={14} />
                    </button>
                  </div>
                )}
                {filteredProperties.length ? (
                  <div
                    className={`property-grid ${layout === "list" ? "list-layout" : ""}`}
                  >
                    {(view === "Overview"
                      ? filteredProperties.slice(0, 3)
                      : filteredProperties
                    ).map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onOpen={setSelected}
                        renter={renter}
                        saved={saved.includes(property.id)}
                        onSave={() =>
                          setSaved(
                            saved.includes(property.id)
                              ? saved.filter((id) => id !== property.id)
                              : [...saved, property.id],
                          )
                        }
                        list={layout === "list"}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Search size={28} />
                    <h3>
                      {view === "Saved homes" && !saved.length
                        ? "Keep the good ones close."
                        : "No homes found."}
                    </h3>
                    <p>
                      {view === "Saved homes" && !saved.length
                        ? "Tap the heart on a home to save it here."
                        : "Try another search or clear your filters."}
                    </p>
                    <button
                      className="text-link"
                      onClick={() => {
                        setQuery("");
                        setFilter("All properties");
                        setMaxRent("any");
                        setMinBeds("any");
                        if (view === "Saved homes") navigate("Explore homes");
                      }}
                    >
                      EXPLORE HOMES <ArrowRight size={15} />
                    </button>
                  </div>
                )}
                {view === "Overview" && <CollectionChart />}
              </div>
              {view === "Overview" && (
                <ActivityPanel
                  maintenance={maintenance}
                  onMaintenance={() => navigate("Maintenance")}
                  onPayments={() => navigate("Payments")}
                />
              )}
            </div>
          )}

          {(view === "Tenants" || view === "Payments") && (
            <section>
              <div className="section-heading">
                <h2>
                  {view === "Tenants"
                    ? "THE PEOPLE AT HOME"
                    : "NOVEMBER COLLECTIONS"}
                </h2>
                <span className="micro">
                  {payments.length}{" "}
                  {view === "Tenants" ? "ACTIVE LEASES" : "PAYMENTS"}
                </span>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>TENANT / PROPERTY</th>
                      <th>MONTHLY RENT</th>
                      <th>{view === "Tenants" ? "LEASE TERM" : "DUE DATE"}</th>
                      <th>PAYMENT STATUS</th>
                      <th>
                        <span className="sr-only">Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => {
                      const property = properties.find(
                        (p) => p.id === payment.propertyId,
                      )!;
                      return (
                        <tr key={property.id}>
                          <td>
                            <strong>{property.tenant}</strong>
                            <span>
                              {property.name} · {property.id}
                            </span>
                          </td>
                          <td>{money(property.rent)}</td>
                          <td>
                            {view === "Tenants"
                              ? "Jan 01 – Dec 31, 2026"
                              : "Nov 01, 2026"}
                          </td>
                          <td>
                            <span
                              className={`table-status ${payment.status === "Overdue" ? "overdue" : ""}`}
                            >
                              <span className="status-dot" />
                              {payment.status}
                            </span>
                          </td>
                          <td>
                            {payment.status === "Overdue" ? (
                              <button
                                className="text-link"
                                onClick={() => {
                                  setPayments(
                                    payments.map((p) =>
                                      p.propertyId === property.id
                                        ? {
                                            ...p,
                                            status: "Paid",
                                            date: "Nov 11, 2026",
                                          }
                                        : p,
                                    ),
                                  );
                                  setNotice(
                                    `Payment recorded for ${property.tenant}.`,
                                  );
                                }}
                              >
                                RECORD PAYMENT <Plus size={14} />
                              </button>
                            ) : (
                              <span className="micro muted flex items-center gap-2">
                                <Check size={14} /> RECEIVED
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="section-footnote">
                {view === "Tenants"
                  ? "A good home starts with a good relationship."
                  : "Demo transactions for November 2026. Record a payment to update your collection totals."}
              </p>
            </section>
          )}

          {view === "Maintenance" && (
            <section>
              <div className="section-heading">
                <h2>A LITTLE UPKEEP GOES A LONG WAY</h2>
                <button
                  className="text-link"
                  onClick={() => setDialog("request")}
                >
                  NEW REQUEST <Plus size={14} />
                </button>
              </div>
              <div className="maintenance-list">
                {maintenance.map((item) => (
                  <div
                    key={item.id}
                    className={`maintenance-row ${item.completed ? "completed" : ""}`}
                  >
                    <span className="request-id micro">{item.id}</span>
                    <Wrench size={21} />
                    <div className="maintenance-copy">
                      <h3>{item.title}</h3>
                      <p>
                        {item.property} · {item.category}
                      </p>
                    </div>
                    <span
                      className={`table-status ${item.priority === "High" && !item.completed ? "overdue" : ""}`}
                    >
                      {item.completed
                        ? "Resolved"
                        : `${item.priority} priority`}
                    </span>
                    <button
                      className="button button-secondary"
                      disabled={item.completed}
                      onClick={() => {
                        setMaintenance(
                          maintenance.map((request) =>
                            request.id === item.id
                              ? { ...request, completed: true }
                              : request,
                          ),
                        );
                        setNotice(`${item.title} marked as resolved.`);
                      }}
                    >
                      {item.completed ? (
                        <>
                          <Check size={14} />
                          RESOLVED
                        </>
                      ) : (
                        <>
                          MARK RESOLVED <ArrowUpRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {view === "My viewings" && (
            <section>
              <div className="section-heading">
                <h2>MAKE YOURSELF AT HOME</h2>
                <span className="micro">{viewings.length} UPCOMING</span>
              </div>
              {viewings.length ? (
                viewings.map((viewing, index) => (
                  <div
                    className="viewing-row"
                    key={`${viewing.property}-${viewing.date}-${viewing.time}`}
                  >
                    <CalendarDays size={28} />
                    <div>
                      <h3>{viewing.property}</h3>
                      <p>
                        {viewing.date} at {viewing.time}
                      </p>
                      <span className="micro">DEMO VIEWING REQUEST</span>
                    </div>
                    <button
                      className="text-link"
                      onClick={() => {
                        setViewings(viewings.filter((_, i) => i !== index));
                        setNotice("Viewing cancelled.");
                      }}
                    >
                      CANCEL <X size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <CalendarDays size={32} />
                  <h3>A new place starts with a visit.</h3>
                  <p>Choose an available home and request a viewing.</p>
                  <button
                    className="button button-primary"
                    onClick={() => navigate("Explore homes")}
                  >
                    FIND A HOME <ArrowUpRight size={15} />
                  </button>
                </div>
              )}
            </section>
          )}

          {view === "Settings" && (
            <section className="settings-section">
              <div className="section-heading">
                <h2>MAKE IT YOURS</h2>
                <span className="micro">WORKSPACE SETTINGS</span>
              </div>
              <form
                className="settings-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  setProfile({
                    name: String(form.get("profileName")).trim(),
                    email: String(form.get("profileEmail")),
                    workspace: String(form.get("workspaceName")).trim(),
                    digest: String(form.get("digest")),
                  });
                  setNotice("Preferences updated for this demo session.");
                }}
              >
                <h3>Profile & preferences</h3>
                <p>Personalize how you work with your homes.</p>
                <div className="form-grid">
                  <label>
                    FULL NAME
                    <input
                      name="profileName"
                      required
                      pattern=".*\S.*"
                      maxLength={60}
                      defaultValue={profile.name}
                    />
                  </label>
                  <label>
                    EMAIL ADDRESS
                    <input
                      name="profileEmail"
                      type="email"
                      required
                      defaultValue={profile.email}
                    />
                  </label>
                  <label>
                    WORKSPACE NAME
                    <input
                      name="workspaceName"
                      required
                      pattern=".*\S.*"
                      maxLength={60}
                      defaultValue={profile.workspace}
                    />
                  </label>
                  <label>
                    EMAIL DIGEST
                    <select name="digest" defaultValue={profile.digest}>
                      <option value="weekly">Weekly summary</option>
                      <option value="daily">Daily summary</option>
                      <option value="off">Off</option>
                    </select>
                  </label>
                </div>
                <button className="button button-primary" type="submit">
                  SAVE PREFERENCES <Check size={15} />
                </button>
              </form>
            </section>
          )}

          <footer className="page-footer">
            <span className="micro">FORME® — SPACE TO LIVE. ROOM TO GROW.</span>
            <span className="micro">
              SAMPLE DATA <span className="footer-separator">/</span> CHANGES
              RESET ON REFRESH <span className="footer-separator">/</span> ©
              2026
            </span>
          </footer>
        </main>
      </div>

      {notice && (
        <div className="toast" role="status">
          <Check size={17} />
          <span>{notice}</span>
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {dialog === "add" && (
        <WorkspaceDialog title="A NEW SPACE." onClose={() => setDialog(null)}>
          <p className="dialog-intro">
            Add a home to your portfolio. You can explore it right away.
          </p>
          <form onSubmit={addProperty}>
            <div className="form-grid">
              <label className="full-width">
                PROPERTY NAME
                <input
                  name="name"
                  required
                  maxLength={80}
                  pattern=".*\S.*"
                  placeholder="e.g. The Garden House"
                />
              </label>
              <label className="full-width">
                STREET ADDRESS
                <input
                  name="address"
                  required
                  maxLength={120}
                  pattern=".*\S.*"
                  placeholder="Street number and name"
                />
              </label>
              <label className="full-width">
                NEIGHBORHOOD & CITY
                <input
                  name="neighborhood"
                  required
                  maxLength={100}
                  pattern=".*\S.*"
                  placeholder="e.g. Silver Lake, Los Angeles"
                />
              </label>
              <label>
                MONTHLY RENT ($)
                <input
                  type="number"
                  name="rent"
                  min="1"
                  max="1000000"
                  required
                  placeholder="2800"
                />
              </label>
              <label>
                AREA (FT²)
                <input
                  type="number"
                  name="area"
                  min="1"
                  max="100000"
                  required
                  placeholder="1800"
                />
              </label>
              <label>
                BEDROOMS
                <input
                  name="beds"
                  type="number"
                  required
                  min="0"
                  max="30"
                  defaultValue="2"
                />
              </label>
              <label>
                BATHROOMS
                <input
                  name="baths"
                  type="number"
                  required
                  min="1"
                  max="30"
                  defaultValue="1"
                />
              </label>
            </div>
            <p className="form-note">
              New homes start as available. A sample property photo is included.
            </p>
            <button className="button button-primary w-full" type="submit">
              ADD TO PORTFOLIO <Plus size={16} />
            </button>
          </form>
        </WorkspaceDialog>
      )}
      {selected && (
        <WorkspaceDialog
          title={booking ? "COME TAKE A LOOK." : selected.name.toUpperCase()}
          onClose={closeProperty}
        >
          {!booking ? (
            <>
              <div className="detail-image relative">
                <Image
                  src={`/images/${selected.image}.jpg`}
                  alt={selected.name}
                  fill
                  sizes="600px"
                  className="object-cover"
                />
              </div>
              <div className="detail-price">
                <strong>{money(selected.rent)}</strong>
                <span> / month</span>
                <span className="table-status ml-auto">{selected.status}</span>
              </div>
              <p className="flex items-center gap-2">
                <MapPin size={16} />
                {selected.address} · {selected.neighborhood}
              </p>
              <dl className="detail-specs">
                <div>
                  <dt>BEDROOMS</dt>
                  <dd>{selected.beds}</dd>
                </div>
                <div>
                  <dt>BATHROOMS</dt>
                  <dd>{selected.baths}</dd>
                </div>
                <div>
                  <dt>FLOOR AREA</dt>
                  <dd>{selected.area.toLocaleString()} ft²</dd>
                </div>
              </dl>
              <p className="detail-description">
                Light-filled rooms, thoughtful details, and a neighborhood worth
                getting to know. A comfortable place to make your own.
              </p>
              {renter ? (
                <button
                  className="button button-primary w-full"
                  onClick={() => setBooking(true)}
                >
                  REQUEST A VIEWING <ArrowUpRight size={16} />
                </button>
              ) : (
                <div className="detail-tenant">
                  <span className="micro">CURRENT TENANT</span>
                  <strong>
                    {selected.tenant ?? "Ready for its next resident"}
                  </strong>
                </div>
              )}
            </>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                setViewings([
                  ...viewings,
                  {
                    property: selected.name,
                    date: String(form.get("date")),
                    time: String(form.get("time")),
                  },
                ]);
                closeProperty();
                navigate("My viewings");
                setNotice(
                  "Viewing added to your demo schedule. No request has been sent.",
                );
              }}
            >
              <p className="dialog-intro">
                Find a time to visit {selected.name}. Viewing requests are
                simulated in this demo.
              </p>
              <div className="form-grid">
                <label>
                  YOUR NAME
                  <input required name="name" autoComplete="name" />
                </label>
                <label>
                  EMAIL
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                  />
                </label>
                <label>
                  DATE
                  <input required type="date" name="date" min="2026-11-12" />
                </label>
                <label>
                  TIME
                  <select name="time">
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                    <option>02:00 PM</option>
                    <option>04:00 PM</option>
                  </select>
                </label>
              </div>
              <button className="button button-primary w-full" type="submit">
                REQUEST VIEWING <ArrowUpRight size={15} />
              </button>
              <button
                type="button"
                className="text-link mt-5"
                onClick={() => setBooking(false)}
              >
                <ChevronLeft size={15} /> BACK TO HOME
              </button>
            </form>
          )}
        </WorkspaceDialog>
      )}
      {dialog === "request" && (
        <WorkspaceDialog
          title="LET’S GET IT FIXED."
          onClose={() => setDialog(null)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              setMaintenance([
                ...maintenance,
                {
                  id: `MT-${String(25 + maintenance.length - initialMaintenance.length).padStart(3, "0")}`,
                  title: String(form.get("title")).trim(),
                  property: String(form.get("property")),
                  category: String(form.get("category")),
                  priority: form.get("priority") === "High" ? "High" : "Normal",
                  completed: false,
                },
              ]);
              setDialog(null);
              setNotice("Maintenance request added.");
            }}
          >
            <div className="form-grid">
              <label className="full-width">
                WHAT NEEDS ATTENTION?
                <input
                  name="title"
                  required
                  maxLength={100}
                  pattern=".*\S.*"
                  placeholder="Describe the issue"
                />
              </label>
              <label className="full-width">
                PROPERTY
                <select name="property">
                  {properties.map((property) => (
                    <option key={property.id}>{property.name}</option>
                  ))}
                </select>
              </label>
              <label>
                CATEGORY
                <select name="category">
                  <option>General</option>
                  <option>Plumbing</option>
                  <option>HVAC</option>
                  <option>Electrical</option>
                </select>
              </label>
              <label>
                PRIORITY
                <select name="priority">
                  <option>Normal</option>
                  <option>High</option>
                </select>
              </label>
            </div>
            <button type="submit" className="button button-primary w-full">
              CREATE REQUEST <Plus size={16} />
            </button>
          </form>
        </WorkspaceDialog>
      )}
      {dialog === "help" && (
        <WorkspaceDialog
          title="ROOM FOR QUESTIONS."
          onClose={() => setDialog(null)}
        >
          <div className="help-content">
            <p>Welcome to your Forme demo workspace.</p>
            <h3>For property managers</h3>
            <p>
              Use Manage to add homes, review tenants, record rent payments, and
              resolve maintenance requests. Export downloads your portfolio as a
              CSV.
            </p>
            <h3>For your next chapter</h3>
            <p>
              Switch to Explore to browse available homes, save your favorites,
              and schedule a sample viewing.
            </p>
            <h3>A space to experiment</h3>
            <p>
              This interface uses illustrative data. Changes last until you
              refresh. Viewing requests and email preferences stay in this
              browser session.
            </p>
          </div>
        </WorkspaceDialog>
      )}
    </div>
  );
}
