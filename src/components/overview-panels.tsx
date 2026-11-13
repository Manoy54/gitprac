import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  Wrench,
} from "lucide-react";
import {
  money,
  type Maintenance,
  type Payment,
  type Property,
} from "@/lib/demo-data";

export function PortfolioStats({
  properties,
  payments,
  maintenance,
}: {
  properties: Property[];
  payments: Payment[];
  maintenance: Maintenance[];
}) {
  const occupied = properties.filter((p) => p.status === "Occupied").length;
  const collected = payments.reduce(
    (total, payment) =>
      total +
      (payment.status === "Paid"
        ? properties.find((p) => p.id === payment.propertyId)!.rent
        : 0),
    0,
  );
  return (
    <section className="stats-grid" aria-label="Portfolio summary">
      <div className="stat-cell">
        <div className="micro flex justify-between">
          TOTAL PROPERTIES <span>[ UNITS ]</span>
        </div>
        <div className="stat-value">
          {String(properties.length).padStart(2, "0")}
          <span className="stat-mark">↗</span>
        </div>
        <p>Your growing collection of homes</p>
      </div>
      <div className="stat-cell">
        <div className="micro flex justify-between">
          OCCUPANCY RATE <span>[ LIVE ]</span>
        </div>
        <div className="stat-value">
          {Math.round((occupied / properties.length) * 100)}
          <span className="stat-unit">%</span>
        </div>
        <p>
          <span className="inline-dot" />
          {occupied} occupied / {properties.length - occupied} available
        </p>
      </div>
      <div className="stat-cell">
        <div className="micro flex justify-between">
          RENT COLLECTED <span>[ NOV ]</span>
        </div>
        <div className="stat-value money-value">{money(collected)}</div>
        <p>
          {payments.filter((p) => p.status === "Paid").length} of{" "}
          {payments.length} payments received
        </p>
      </div>
      <div className="stat-cell">
        <div className="micro flex justify-between">
          OPEN REQUESTS <Wrench size={13} />
        </div>
        <div className="stat-value">
          {String(
            maintenance.filter((item) => !item.completed).length,
          ).padStart(2, "0")}
          <span className="request-marker" />
        </div>
        <p>
          {
            maintenance.filter(
              (item) => item.priority === "High" && !item.completed,
            ).length
          }{" "}
          high priority · needs your attention
        </p>
      </div>
    </section>
  );
}

export function ActivityPanel({
  maintenance,
  onMaintenance,
  onPayments,
}: {
  maintenance: Maintenance[];
  onMaintenance: () => void;
  onPayments: () => void;
}) {
  return (
    <aside className="activity-panel">
      <div className="section-heading">
        <h2>THE LATEST</h2>
        <span className="micro">ACTIVITY LOG</span>
      </div>
      <div className="activity-list">
        <div className="activity-item">
          <span className="activity-icon">
            <ArrowDownLeft size={16} />
          </span>
          <div>
            <p>Rent payment received</p>
            <span>Alex Morgan · The Olive House</span>
            <div className="micro">TODAY, 09:42 AM</div>
          </div>
          <strong>+ $2,400</strong>
        </div>
        <div className="activity-item">
          <span className="activity-icon red">
            <Wrench size={16} />
          </span>
          <div>
            <p>New maintenance request</p>
            <span>Kitchen faucet leak · The Olive House</span>
            <div className="micro">TODAY, 08:15 AM</div>
          </div>
        </div>
        <div className="activity-item">
          <span className="activity-icon">
            <Check size={16} />
          </span>
          <div>
            <p>November payment confirmed</p>
            <span>Taylor Brooks · Oak & Stone</span>
            <div className="micro">NOV 03, 10:30 AM</div>
          </div>
        </div>
      </div>
      <button className="text-link" onClick={onPayments}>
        VIEW PAYMENTS <ArrowRight size={15} />
      </button>
      <div className="attention-panel">
        <div className="flex items-center gap-2 micro">
          <CircleAlert size={15} /> ON YOUR RADAR
        </div>
        <h3>
          A little care.
          <br />A better home.
        </h3>
        <p>
          {maintenance.filter((item) => !item.completed).length} maintenance
          requests are waiting for your attention.
        </p>
        <button className="text-link" onClick={onMaintenance}>
          REVIEW REQUESTS <ArrowUpRight size={16} />
        </button>
        <div className="warning-pattern" aria-hidden="true" />
      </div>
    </aside>
  );
}

export function CollectionChart() {
  const months = ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT"];
  const collected = [58, 67, 62, 79, 73, 91];
  return (
    <section className="collection-panel">
      <div className="section-heading">
        <h2>RENT, IN PERSPECTIVE</h2>
        <span className="micro">LAST 6 MONTHS</span>
      </div>
      <div className="chart-legend micro">
        <span className="legend-square" /> COLLECTED{" "}
        <span className="legend-square expected" /> EXPECTED
      </div>
      <div
        className="collection-chart"
        role="img"
        aria-label="Illustrative rent collection: May 58%, June 67%, July 62%, August 79%, September 73%, October 91% of expected rent"
      >
        <div className="chart-y micro">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
        <div className="chart-bars">
          {months.map((month, index) => (
            <div className="chart-column" key={month}>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ height: `${collected[index]}%` }}
                />
              </div>
              <span className="micro">{month}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
