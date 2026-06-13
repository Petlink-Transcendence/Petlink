import './SitterAvailabilityPanel.css';

type AvailabilityWindow = {
  label: string;
  time: string;
};

type ServiceRate = {
  name: string;
  rate: string;
  detail: string;
};

type AvailabilityStatus = 'Accepting' | 'Not available';

type SitterAvailabilityPanelProps = {
  status: AvailabilityStatus;
  location: string;
  responseTime: string;
  capacity: string;
  windows: AvailabilityWindow[];
  services: ServiceRate[];
  canEdit?: boolean;
  onAvailabilityToggle: () => void;
  onUpdateAvailability: () => void;
};

export default function SitterAvailabilityPanel({
  status,
  location,
  responseTime,
  capacity,
  windows,
  services,
  canEdit = true,
  onAvailabilityToggle,
  onUpdateAvailability,
}: SitterAvailabilityPanelProps) {
  const isAccepting = status === 'Accepting';

  return (
    <div className="profile-card sitter-availability-card">
      <div className="sitter-availability-header">
        <h3 className="card-title">Current Availability</h3>
        <div className="sitter-availability-controls">
          <span className={`sitter-availability-status ${isAccepting ? 'is-accepting' : 'is-unavailable'}`}>
            {status}
          </span>
          {canEdit && (
            <label className="sitter-availability-toggle">
              <span>Available</span>
              <input
                type="checkbox"
                checked={isAccepting}
                onChange={onAvailabilityToggle}
                aria-label="Change current availability"
              />
              <span className="sitter-availability-switch" aria-hidden="true" />
            </label>
          )}
        </div>
      </div>

      <div className="sitter-availability-metrics">
        <div>
          <span>Area</span>
          <strong>{location}</strong>
        </div>
        <div>
          <span>Reply time</span>
          <strong>{responseTime}</strong>
        </div>
        <div>
          <span>Capacity</span>
          <strong>{capacity}</strong>
        </div>
      </div>

      <div className="sitter-availability-section">
        <h4>Available times</h4>
        <div className="sitter-availability-windows">
          {windows.map(window => (
            <div key={window.label} className="sitter-availability-window">
              <span>{window.label}</span>
              <strong>{window.time}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="sitter-availability-section">
        <h4>Services</h4>
        <div className="sitter-service-list">
          {services.map(service => (
            <div key={service.name} className="sitter-service-row">
              <div>
                <span>{service.name}</span>
                <p>{service.detail}</p>
              </div>
              <strong>{service.rate}</strong>
            </div>
          ))}
        </div>
      </div>

      {canEdit && (
        <button
          className="sitter-availability-action"
          type="button"
          onClick={onUpdateAvailability}
        >
          Update Availability
        </button>
      )}
    </div>
  );
}
