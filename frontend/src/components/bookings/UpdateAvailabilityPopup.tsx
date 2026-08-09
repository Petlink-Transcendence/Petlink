import { useState, type FormEvent } from 'react';
import './UpdateAvailabilityPopup.css';

export type AvailabilityTimeSlot = {
  label: string;
  time: string;
};

export type AvailabilityFormData = {
  location: string;
  capacity: string;
  timeSlots: string;
  availableTimes: AvailabilityTimeSlot[];
};

type UpdateAvailabilityPopupProps = {
  onClose: () => void;
  initialLocation?: string;
  initialCapacity?: string;
  initialAvailableTimes?: AvailabilityTimeSlot[];
  onSaveAvailability?: (availability: AvailabilityFormData) => void | Promise<void>;
};

const DAY_PRESETS = [
  'Mon - Fri',
  'Sat - Sun',
  'Mon - Sun',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
  'Custom',
];

const DAYS_MAP: Record<string, string[]> = {
  'mon - fri': ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  'sat - sun': ['saturday', 'sunday'],
  'mon - sun': ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  'monday': ['monday'],
  'tuesday': ['tuesday'],
  'wednesday': ['wednesday'],
  'thursday': ['thursday'],
  'friday': ['friday'],
  'saturday': ['saturday'],
  'sunday': ['sunday'],
  'mon': ['monday'],
  'tue': ['tuesday'],
  'wed': ['wednesday'],
  'thu': ['thursday'],
  'fri': ['friday'],
  'sat': ['saturday'],
  'sun': ['sunday'],
};

export function expandPeriodToDays(label: string): Set<string> {
  const normalized = label.trim().toLowerCase();
  const days = new Set<string>();

  if (DAYS_MAP[normalized]) {
    DAYS_MAP[normalized].forEach(d => days.add(d));
    return days;
  }

  const rangeMatch = normalized.match(/^(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*-\s*(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/);
  if (rangeMatch) {
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const getFullName = (d: string) => {
      if (d.startsWith('mon')) return 'monday';
      if (d.startsWith('tue')) return 'tuesday';
      if (d.startsWith('wed')) return 'wednesday';
      if (d.startsWith('thu')) return 'thursday';
      if (d.startsWith('fri')) return 'friday';
      if (d.startsWith('sat')) return 'saturday';
      if (d.startsWith('sun')) return 'sunday';
      return d;
    };

    const startDay = getFullName(rangeMatch[1]);
    const endDay = getFullName(rangeMatch[2]);

    const startIndex = dayOrder.indexOf(startDay);
    const endIndex = dayOrder.indexOf(endDay);

    if (startIndex !== -1 && endIndex !== -1) {
      if (startIndex <= endIndex) {
        for (let i = startIndex; i <= endIndex; i++) {
          days.add(dayOrder[i]);
        }
      } else {
        for (let i = startIndex; i < dayOrder.length; i++) days.add(dayOrder[i]);
        for (let i = 0; i <= endIndex; i++) days.add(dayOrder[i]);
      }
      return days;
    }
  }

  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayAbbrevs = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  dayNames.forEach((d, idx) => {
    if (normalized.includes(d) || normalized.includes(dayAbbrevs[idx])) {
      days.add(d);
    }
  });

  return days;
}

export function findOverlappingDay(newLabel: string, existingSlots: AvailabilityTimeSlot[]): { hasOverlap: boolean; overlappingDay?: string; existingLabel?: string } {
  const newDays = expandPeriodToDays(newLabel);

  for (const slot of existingSlots) {
    const existingDays = expandPeriodToDays(slot.label);

    for (const day of newDays) {
      if (existingDays.has(day)) {
        const displayDay = day.charAt(0).toUpperCase() + day.slice(1);
        return {
          hasOverlap: true,
          overlappingDay: displayDay,
          existingLabel: slot.label,
        };
      }
    }
  }

  return { hasOverlap: false };
}

export function formatTimeString(value: string, prevValue: string = ''): string {
  const digits = value.replace(/[^\d]/g, '');

  if (prevValue.endsWith(':') && value.length < prevValue.length) {
    return digits.slice(0, 1);
  }

  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  }

  return digits;
}

export function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const parts = timeStr.trim().split(':');
  if (parts.length !== 2) return null;

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

export function validateTimeRange(startStr: string, endStr: string): { valid: boolean; error?: string } {
  const startMins = parseTimeToMinutes(startStr);
  const endMins = parseTimeToMinutes(endStr);

  if (startMins === null || endMins === null) {
    return { valid: false, error: 'Please enter valid times in 24h format (e.g. 09:00).' };
  }

  if (startMins >= endMins) {
    return { valid: false, error: 'Start time must be earlier than end time.' };
  }

  return { valid: true };
}

function validateSlotTimeRange(timeSlotStr: string): { valid: boolean; error?: string } {
  const rangeMatch = timeSlotStr.match(/^(.+?)\s*-\s*(.+)$/);
  if (!rangeMatch) return { valid: true };

  return validateTimeRange(rangeMatch[1].trim(), rangeMatch[2].trim());
}

function formatAvailableTimesForInput(availableTimes: AvailabilityTimeSlot[]) {
  return availableTimes.map(({ label, time }) => `${label}: ${time}`).join('\n');
}

export default function UpdateAvailabilityPopup({
  onClose,
  initialLocation = '',
  initialCapacity = '',
  initialAvailableTimes = [],
  onSaveAvailability,
}: UpdateAvailabilityPopupProps) {
  const [location, setLocation] = useState(initialLocation);
  const [capacity, setCapacity] = useState(initialCapacity);
  const [slots, setSlots] = useState<AvailabilityTimeSlot[]>(initialAvailableTimes);

  // Time Slot Builder state
  const [selectedDayOption, setSelectedDayOption] = useState('Mon - Fri');
  const [customDays, setCustomDays] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('15:00');

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleAddSlot = () => {
    const dayLabel = selectedDayOption === 'Custom' ? customDays.trim() : selectedDayOption;
    if (!dayLabel) {
      setSaveError('Please specify the days/period for availability.');
      return;
    }
    if (!startTime || !endTime) {
      setSaveError('Please select both start and end times.');
      return;
    }

    const validation = validateTimeRange(startTime, endTime);
    if (!validation.valid) {
      setSaveError(validation.error || 'Start time must be earlier than end time.');
      return;
    }

    const overlap = findOverlappingDay(dayLabel, slots);
    if (overlap.hasOverlap) {
      setSaveError(`Cannot add "${dayLabel}": ${overlap.overlappingDay} is already included in your "${overlap.existingLabel}" period.`);
      return;
    }

    setSaveError('');
    const newSlot: AvailabilityTimeSlot = {
      label: dayLabel,
      time: `${startTime} - ${endTime}`,
    };

    setSlots(prev => [...prev, newSlot]);
    if (selectedDayOption === 'Custom') {
      setCustomDays('');
    }
  };

  const handleAddPresetSlot = (label: string, start: string, end: string) => {
    const overlap = findOverlappingDay(label, slots);
    if (overlap.hasOverlap) {
      setSaveError(`Cannot add "${label}": ${overlap.overlappingDay} is already included in your "${overlap.existingLabel}" period.`);
      return;
    }
    setSaveError('');
    setSlots(prev => [...prev, { label, time: `${start} - ${end}` }]);
  };

  const handleRemoveSlot = (indexToRemove: number) => {
    setSlots(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!location.trim() || !capacity.trim() || slots.length === 0) {
      setSaveError('Please complete location, capacity, and add at least one availability period.');
      return;
    }

    for (const slot of slots) {
      const validation = validateSlotTimeRange(slot.time);
      if (!validation.valid) {
        setSaveError(`Period "${slot.label}": ${validation.error}`);
        return;
      }
    }

    setIsSaving(true);
    setSaveError('');
    try {
      const formattedTimesString = formatAvailableTimesForInput(slots);
      await onSaveAvailability?.({
        location: location.trim(),
        capacity: capacity.trim(),
        timeSlots: formattedTimesString,
        availableTimes: slots,
      });
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save availability.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="availability-overlay" onClick={onClose}>
      <section className="availability-container" onClick={event => event.stopPropagation()}>
        <header className="availability-header">
          <h2>Update Availability</h2>
          <button
            type="button"
            className="availability-close"
            onClick={onClose}
            aria-label="Close availability form"
          >
            &times;
          </button>
        </header>

        <form className="availability-form" onSubmit={handleSubmit}>
          <div className="availability-row">
            <label className="availability-field">
              <span className="required-label">Location</span>
              <input
                type="text"
                value={location}
                onChange={event => setLocation(event.target.value)}
                placeholder="Porto"
                required
              />
            </label>

            <label className="availability-field">
              <span className="required-label">Capacity</span>
              <input
                type="text"
                value={capacity}
                onChange={event => setCapacity(event.target.value)}
                placeholder="2 bookings/day"
                required
              />
            </label>
          </div>

          <div className="availability-section-header">
            <span className="required-label availability-section-title">Available Periods & Times</span>
          </div>

          {/* Added Slots List */}
          <div className="slots-list-container">
            <span className="slots-list-title">Current Periods:</span>
            {slots.length === 0 ? (
              <div className="slots-empty-msg">
                No availability periods added yet. Use the builder below or choose a quick preset.
              </div>
            ) : (
              <div className="slots-grid">
                {slots.map((slot, index) => (
                  <div key={`${slot.label}-${slot.time}-${index}`} className="slot-chip">
                    <div className="slot-chip-info">
                      <span className="slot-chip-label">{slot.label}</span>
                      <span className="slot-chip-time">⏰ {slot.time}</span>
                    </div>
                    <button
                      type="button"
                      className="slot-chip-remove"
                      onClick={() => handleRemoveSlot(index)}
                      title="Remove period"
                      aria-label={`Remove ${slot.label} availability`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Presets */}
          <div className="presets-wrapper">
            <span className="presets-label">⚡ Quick Add Presets:</span>
            <div className="presets-list">
              <button
                type="button"
                className="preset-btn"
                onClick={() => handleAddPresetSlot('Mon - Fri', '09:00', '17:00')}
              >
                + Mon - Fri | 9:00 - 17:00
              </button>
              <button
                type="button"
                className="preset-btn"
                onClick={() => handleAddPresetSlot('Sat - Sun', '10:00', '16:00')}
              >
                + Sat - Sun | 10:00 - 16:00
              </button>
            </div>
          </div>

          {/* Interactive Period Builder */}
          <div className="slot-builder-box">
            <span className="builder-title">➕ Add Custom Availability Period</span>
            <div className="builder-fields">
              <label className="availability-field">
                <span>Days / Period</span>
                <select
                  value={selectedDayOption}
                  onChange={e => setSelectedDayOption(e.target.value)}
                >
                  {DAY_PRESETS.map(preset => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </select>
              </label>

              {selectedDayOption === 'Custom' && (
                <label className="availability-field">
                  <span>Custom Period Name</span>
                  <input
                    type="text"
                    placeholder="e.g. Tue & Thu"
                    value={customDays}
                    onChange={e => setCustomDays(e.target.value)}
                  />
                </label>
              )}

              <label className="availability-field">
                <span>Start Time</span>
                <input
                  type="text"
                  placeholder="09:00"
                  maxLength={5}
                  value={startTime}
                  onChange={e => setStartTime(prev => formatTimeString(e.target.value, prev))}
                />
              </label>

              <label className="availability-field">
                <span>End Time</span>
                <input
                  type="text"
                  placeholder="15:00"
                  maxLength={5}
                  value={endTime}
                  onChange={e => setEndTime(prev => formatTimeString(e.target.value, prev))}
                />
              </label>
            </div>

            <button
              type="button"
              className="add-slot-btn"
              onClick={handleAddSlot}
            >
              + Add Period to List
            </button>
          </div>

          {saveError && <p role="alert" className="availability-error">{saveError}</p>}

          <button type="submit" className="availability-submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Availability'}
          </button>
        </form>
      </section>
    </div>
  );
}


