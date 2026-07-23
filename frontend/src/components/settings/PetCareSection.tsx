import type { Pet, SettingsForm } from '../../pages/Settings';
import '../../pages/Settings.css';

const lookingForOptions = ['cat sitter', 'dog walker', 'home visits', 'overnight stay'];
const sitterPetTypeOptions = ['dogs', 'cats', 'rabbits', 'small pets', 'big pets'];

const ageOptions = [
  '<1 yr',
  '1 yr',
  ...Array.from({ length: 11 }, (_, i) => `${i + 2} yrs`),
  '>12 yrs',
];

interface PetCareSectionProps {
  accountMode: string;
  petsList: Pet[];
  lookingForServices: string[];
  yearsOfExperience: string;
  hourlyRate: string;
  sitterPetTypes: string[];
  newPetName: string;
  newPetType: Pet['type'];
  newPetBreed: string;
  newPetAge: string;
  setNewPetName: (v: string) => void;
  setNewPetType: (v: Pet['type']) => void;
  setNewPetBreed: (v: string) => void;
  setNewPetAge: (v: string) => void;
  toggleTagField: (key: 'lookingForServices' | 'sitterPetTypes', tag: string) => void;
  handleAddPet: () => void;
  handleRemovePet: (id: string) => void;
  updateField: <K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) => void;
}

export default function PetCareSection({
  accountMode,
  petsList,
  lookingForServices,
  yearsOfExperience,
  hourlyRate,
  sitterPetTypes,
  newPetName,
  newPetType,
  newPetBreed,
  newPetAge,
  setNewPetName,
  setNewPetType,
  setNewPetBreed,
  setNewPetAge,
  toggleTagField,
  handleAddPet,
  handleRemovePet,
  updateField,
}: PetCareSectionProps) {
  return (
    <section className="settings-section" id="care">
      <div className="settings-section-header">
        <div>
          <h2>Pet care</h2>
          <p>Profile mode, pets and service preferences</p>
        </div>
      </div>

      {accountMode === 'owner' && (
        <div className="mode-specific-fields owner-mode animate-fade-in">
          <div className="settings-input-group">
            <span className="settings-group-label">Manage My Pets:</span>

            <div className="add-pet-inline-form">
              <input
                type="text"
                placeholder="Pet name"
                value={newPetName}
                onChange={(e) => setNewPetName(e.target.value)}
                className="pet-input-field pet-name-input"
              />
              <select
                value={newPetType}
                onChange={(e) => setNewPetType(e.target.value as Pet['type'])}
                className="pet-input-field pet-type-select"
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="rabbit">Rabbit</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Breed"
                value={newPetBreed}
                onChange={(e) => setNewPetBreed(e.target.value)}
                className="pet-input-field pet-breed-input"
              />
              <select
                value={newPetAge}
                onChange={(e) => setNewPetAge(e.target.value)}
                className="pet-input-field pet-age-select"
              >
                {ageOptions.map((age) => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
              <button type="button" className="add-pet-btn" onClick={handleAddPet}>
                + Add
              </button>
            </div>

            <div className="added-pets-badge-list">
              {petsList.map((pet) => (
                <div key={pet.id} className="pet-badge-item">
                  <span>
                    {pet.name} | <span className="capitalize-text">{pet.type}</span> | {pet.breed} | {pet.age}
                  </span>
                  <button
                    type="button"
                    className="remove-pet-badge"
                    onClick={() => handleRemovePet(pet.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="settings-input-group">
            <span className="settings-group-label">I am looking for:</span>
            <div className="settings-service-list">
              {lookingForOptions.map((service) => (
                <label className="settings-check-row" key={service}>
                  <input
                    type="checkbox"
                    checked={lookingForServices.includes(service)}
                    onChange={() => toggleTagField('lookingForServices', service)}
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {accountMode === 'sitter' && (
        <div className="mode-specific-fields sitter-mode animate-fade-in">
          <div className="settings-grid">
            <label className="settings-field sitter-open-field">
              <span>Years of Experience</span>
              <input
                type="text"
                placeholder=" +3 years"
                value={yearsOfExperience}
                onChange={(e) => updateField('yearsOfExperience', e.target.value)}
                className="pet-input-field"
              />
            </label>
            <label className="settings-field sitter-open-field">
              <span>Price per Hour (€)</span>
              <input
                type="text"
                placeholder="10-15"
                value={hourlyRate}
                onChange={(e) => updateField('hourlyRate', e.target.value)}
                className="pet-input-field"
              />
            </label>
          </div>

          <div className="settings-input-group">
            <span className="settings-group-label">I can pet-sit:</span>
            <div className="settings-service-list">
              {sitterPetTypeOptions.map((type) => (
                <label className="settings-check-row" key={type}>
                  <input
                    type="checkbox"
                    checked={sitterPetTypes.includes(type)}
                    onChange={() => toggleTagField('sitterPetTypes', type)}
                  />
                  <span className="capitalize-text">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
