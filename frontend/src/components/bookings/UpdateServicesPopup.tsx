import { useState, type FormEvent } from 'react';
import './UpdateAvailabilityPopup.css';
import { formatAvailabilityRate } from '../../utils/availabilityRates';

export type ServiceRateFormData = {
  name: string;
  rate: string;
  detail: string;
};

type UpdateServicesPopupProps = {
  services: ServiceRateFormData[];
  onClose: () => void;
  onSaveServices: (services: ServiceRateFormData[]) => void;
};

function formatServiceName(serviceName: string) {
  return serviceName.trim().replace(/\b\w/g, letter => letter.toUpperCase());
}

function normalizeService(service: ServiceRateFormData) {
  return {
    name: formatServiceName(service.name),
    rate: formatAvailabilityRate(service.rate),
    detail: service.detail.trim(),
  };
}

export default function UpdateServicesPopup({
  services,
  onClose,
  onSaveServices,
}: UpdateServicesPopupProps) {
  const [serviceRates, setServiceRates] = useState<ServiceRateFormData[]>(services);
  const [newService, setNewService] = useState<ServiceRateFormData>({
    name: '',
    rate: '',
    detail: '',
  });

  const removeService = (index: number) => {
    setServiceRates(currentServices => currentServices.filter((_, serviceIndex) => serviceIndex !== index));
  };

  const updateNewService = (field: keyof ServiceRateFormData, value: string) => {
    setNewService(currentService => ({ ...currentService, [field]: value }));
  };

  const addService = () => {
    const nextService = normalizeService(newService);

    if (!nextService.name || !nextService.rate) {
      return;
    }

    setServiceRates(currentServices => [...currentServices, nextService]);
    setNewService({ name: '', rate: '', detail: '' });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextServices = serviceRates.map(normalizeService);

    if (nextServices.some(service => !service.name || !service.rate)) {
      return;
    }

    onSaveServices(nextServices);
    onClose();
  };

  return (
    <div className="availability-overlay" onClick={onClose}>
      <section className="availability-container" onClick={event => event.stopPropagation()}>
        <header className="availability-header">
          <h2>Update Services</h2>
          <button
            type="button"
            className="availability-close"
            onClick={onClose}
            aria-label="Close services form"
          >
            &times;
          </button>
        </header>

        <form className="availability-form" onSubmit={handleSubmit}>
          <fieldset className="availability-services">
            <legend>Current services</legend>
            <div className="service-price-list">
              {serviceRates.map((service, index) => (
                <div key={`${service.name}-${index}`} className="service-price-item">
                  <div className="service-price-row">
                    <div>
                      <span>{service.name}</span>
                      <p>{service.detail}</p>
                    </div>
                    <strong>{formatAvailabilityRate(service.rate)}</strong>
                  </div>
                  <button
                    type="button"
                    className="service-remove-button"
                    onClick={() => removeService(index)}
                    aria-label={`Remove ${service.name}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="availability-services">
            <legend>Add service</legend>
            <div className="service-price-item service-add-item">
              <label className="availability-field">
                <span className="required-label">Service type</span>
                <input
                  type="text"
                  value={newService.name}
                  onChange={event => updateNewService('name', event.target.value)}
                  placeholder="Cat Sitting"
                />
              </label>

              <label className="availability-field">
                <span className="required-label">Price</span>
                <input
                  type="text"
                  value={newService.rate}
                  onChange={event => updateNewService('rate', event.target.value)}
                  placeholder="20 EUR per visit"
                />
              </label>

              <label className="availability-field service-detail-field">
                <span>Notes</span>
                <textarea
                  value={newService.detail}
                  onChange={event => updateNewService('detail', event.target.value)}
                  placeholder="Daily visits, feeding, litter care"
                  rows={3}
                />
              </label>

              <button
                type="button"
                className="availability-submit service-add-button"
                onClick={addService}
              >
                Add Service
              </button>
            </div>
          </fieldset>

          <button type="submit" className="availability-submit">
            Save Services
          </button>
        </form>
      </section>
    </div>
  );
}
