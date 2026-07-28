import { useState, type FormEvent } from 'react';
import './UpdateAvailabilityPopup.css';
import { formatAvailabilityRate } from '../../utils/availabilityRates';

export type ServiceRateFormData = {
  id?: number;
  name: string;
  rate: string;
  detail: string;
};

type UpdateServicesPopupProps = {
  services: ServiceRateFormData[];
  onClose: () => void;
  onSaveServices: (services: ServiceRateFormData[]) => void | Promise<void>;
  onAddService?: (service: ServiceRateFormData) => Promise<ServiceRateFormData>;
  onRemoveService?: (service: ServiceRateFormData) => Promise<void>;
};

function formatServiceName(serviceName: string) {
  return serviceName.trim().replace(/\b\w/g, letter => letter.toUpperCase());
}

function normalizeService(service: ServiceRateFormData) {
  return {
    id: service.id,
    name: formatServiceName(service.name),
    rate: formatAvailabilityRate(service.rate),
    detail: service.detail.trim(),
  };
}

export default function UpdateServicesPopup({
  services,
  onClose,
  onSaveServices,
  onAddService,
  onRemoveService,
}: UpdateServicesPopupProps) {
  const [serviceRates, setServiceRates] = useState<ServiceRateFormData[]>(services);
  const [newService, setNewService] = useState<ServiceRateFormData>({
    name: '',
    rate: '',
    detail: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [mutatingIndex, setMutatingIndex] = useState<number | null>(null);
  const [saveError, setSaveError] = useState('');

  const removeService = async (index: number) => {
    const service = serviceRates[index];
    setSaveError('');
    setMutatingIndex(index);

    try {
      await onRemoveService?.(service);
      setServiceRates(currentServices => currentServices.filter((_, serviceIndex) => serviceIndex !== index));
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to remove service.');
    } finally {
      setMutatingIndex(null);
    }
  };

  const updateNewService = (field: keyof ServiceRateFormData, value: string) => {
    setNewService(currentService => ({ ...currentService, [field]: value }));
  };

  const addService = async () => {
    const nextService = normalizeService(newService);

    if (!nextService.name || !nextService.rate) {
      return;
    }

    setSaveError('');
    setMutatingIndex(-1);

    try {
      const savedService = onAddService ? await onAddService(nextService) : nextService;
      setServiceRates(currentServices => [...currentServices, savedService]);
      setNewService({ name: '', rate: '', detail: '' });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to add service.');
    } finally {
      setMutatingIndex(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextServices = serviceRates.map(normalizeService);

    if (nextServices.some(service => !service.name || !service.rate)) {
      return;
    }

    setIsSaving(true);
    setSaveError('');
    try {
      await onSaveServices(nextServices);
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save services.');
    } finally {
      setIsSaving(false);
    }
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
                    onClick={() => void removeService(index)}
                    disabled={isSaving || mutatingIndex !== null}
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
                onClick={() => void addService()}
                disabled={isSaving || mutatingIndex !== null}
              >
                {mutatingIndex === -1 ? 'Adding Service...' : 'Add Service'}
              </button>
            </div>
          </fieldset>

          {saveError && <p role="alert">{saveError}</p>}

          <button type="submit" className="availability-submit" disabled={isSaving}>
            {isSaving ? 'Saving Services...' : 'Save Services'}
          </button>
        </form>
      </section>
    </div>
  );
}
