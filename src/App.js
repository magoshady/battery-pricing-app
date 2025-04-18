import { useState } from 'react';
import { BatteryFull, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const batteryPrices = {
  5: 5999,
  10: 6770,
  15: 7500,
  20: 8500,
  25: 9300,
  30: 12000,
};

const installAddons = [
  { name: 'Switchboard Upgrade', cost: 350 },
  { name: 'Backup Power (Essential Circuits)', cost: 350 },
  { name: 'Garage Installation', cost: 650 },
  { name: 'Three Phase Installation', cost: 250 },
  { name: 'Cement Sheeting Installation', cost: 400 },
  { name: 'Over 5m to Meterbox', cost: 250 },
];

const installTooltips = [
  'Required if your switchboard is outdated or incompatible with battery systems.',
  'Only one light circuit and one outlet can be backup with this product ',
  'Extra work required for garage installation, including fire-alarms',
  'Three-Phase Installation requires extra monitoring configurations',
  'Required for combustible material walls.',
  'Extra cabling and isolators are required for distances over 5m from the meter box.'
];

export default function BatteryApp() {
  const [importKWh, setImportKWh] = useState('');
  const [exportKWh, setExportKWh] = useState('');
  const [qualified, setQualified] = useState(false);
  const [recommendedSize, setRecommendedSize] = useState(0);
  const [batterySize, setBatterySize] = useState(0);
  const [step, setStep] = useState(0);
  const [toggles, setToggles] = useState(Array(installAddons.length).fill(false));
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', address: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleQualification = () => {
    const imp = parseFloat(importKWh);
    const exp = parseFloat(exportKWh);
    if (isNaN(imp) || isNaN(exp)) return;
    if (imp > exp) {
      alert('Please book a call — Import is higher than Export.');
      return;
    }
    if (imp < 1 || exp < 1) {
      alert('Please book a call — You must have solar data.');
      return;
    }
    const recSize = Math.min(30, Math.floor(exp / 5) * 5);
    setRecommendedSize(recSize);
    setBatterySize(recSize);
    setQualified(true);
    setStep(0);
  };

  const toggleAddon = (i) => {
    const newToggles = [...toggles];
    newToggles[i] = !newToggles[i];
    setToggles(newToggles);
  };

  const calculateTotal = () => {
    const batteryCost = batteryPrices[batterySize] || 0;
    const addonsCost = toggles.reduce((sum, val, i) => val ? sum + installAddons[i].cost : sum, 0);
    return batteryCost + addonsCost;
  };

  const formatCurrency = (value) => `$${value.toLocaleString()}`;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formStep < formFields.length - 1) {
      setFormStep((prev) => prev + 1);
    } else {
      setSubmitted(true);
    }
  };

  const formFields = [
    { name: 'name', placeholder: 'Full Name' },
    { name: 'address', placeholder: 'Address' },
    { name: 'email', placeholder: 'Email' },
    { name: 'phone', placeholder: 'Mobile Number' }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-md mx-auto font-sans">
      {!qualified && (
        <div className="bg-zinc-900 p-4 rounded-xl shadow space-y-4">
          <h1 className="text-xl font-bold">Let’s see if a battery makes sense for you 🔍</h1>
          <input
            type="number"
            placeholder="Daily Import (kWh)"
            value={importKWh}
            onChange={(e) => setImportKWh(e.target.value)}
            className="w-full border p-2 rounded bg-black border-white text-white"
          />
          <input
            type="number"
            placeholder="Daily Export (kWh)"
            value={exportKWh}
            onChange={(e) => setExportKWh(e.target.value)}
            className="w-full border p-2 rounded bg-black border-white text-white"
          />
          <button
            className="w-full bg-[#CBF7DA] text-black p-3 rounded-xl shadow hover:bg-[#b7eecb] transition-all duration-150"
            onClick={handleQualification}
          >
            Recommend My Battery Size
          </button>
        </div>
      )}

      {qualified && step === 0 && (
        <div className="bg-zinc-900 p-4 rounded-xl shadow space-y-4 mt-6">
          <h2 className="flex items-center text-lg font-semibold gap-2">
            <BatteryFull className="w-5 h-5" />
            Recommended Size: {recommendedSize}kWh
          </h2>
          <div className="grid grid-cols-3 gap-2 justify-center">
            {[5, 10, 15, 20, 25, 30].map((size) => (
              <button
                key={size}
                onClick={() => setBatterySize(size)}
                className={`text-sm p-2 border rounded transition-all duration-150 ${
                  batterySize === size ? 'bg-green-600 text-white' : 'hover:bg-green-100 text-white'
                }`}
              >
                {size}kWh
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-3">
            {[...Array(batterySize / 5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 bg-green-500 rounded shadow-md mx-0.5 border border-green-300"
              />
            ))}
          </div>
          <button
            className="w-full bg-[#CBF7DA] text-black p-3 rounded-xl shadow hover:bg-[#b7eecb] transition-all duration-150"
            onClick={() => setStep(step + 1)}
          >
            Next
          </button>
        </div>
      )}

      {qualified && step > 0 && step <= installAddons.length && (
        <div className="bg-zinc-900 p-4 rounded-xl shadow space-y-4 mt-6">
          <h3 className="font-semibold text-center">Do you need:</h3>
          <AnimatePresence mode="wait">
            <motion.label
              key={step}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="flex items-center justify-between border p-3 rounded-xl shadow bg-zinc-800"
            >
              <span className="flex items-center gap-2">
                {installAddons[step - 1].name}
                <div className="relative group cursor-pointer">
                  <Info size={16} className="text-gray-400" />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-zinc-700 text-xs text-white px-2 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 w-52 text-center leading-tight">                    {installTooltips[step - 1]}
                  </div>
                </div>
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  id={`toggle-${step}`}
                  className="sr-only"
                  checked={toggles[step - 1]}
                  onChange={() => toggleAddon(step - 1)}
                />
                <div
                  className={`block w-10 h-6 rounded-full transition duration-200 ${
                    toggles[step - 1] ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                    toggles[step - 1] ? 'translate-x-4' : ''
                  }`}
                ></div>
              </div>
            </motion.label>
          </AnimatePresence>
          <button
            className="w-full bg-[#CBF7DA] text-black p-3 rounded-xl shadow hover:bg-[#b7eecb] transition-all duration-150"
            onClick={() => setStep(step + 1)}
          >
            {step < installAddons.length ? 'Next' : 'Finish'}
          </button>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
            <div
              className="bg-[#CBF7DA] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / (installAddons.length + 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {qualified && step > installAddons.length && !showForm && (
        <motion.div
          key="summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="bg-zinc-900 p-6 rounded-xl shadow space-y-4 mt-6"
        >
          <h2 className="text-lg font-bold">Quote Summary</h2>
          <p>Battery Size: {batterySize}kWh</p>
          <p>Battery Cost: {formatCurrency(batteryPrices[batterySize])}</p>
          <p>
            Installation Add-ons: {formatCurrency(
              toggles.reduce((sum, val, i) => (val ? sum + installAddons[i].cost : sum), 0)
            )}
          </p>
          <p className="text-xl font-semibold">Total: {formatCurrency(calculateTotal())}</p>
          <div className="grid grid-cols-1 gap-2">
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-green-600 text-white p-3 text-center rounded-xl"
            >
              Order Now
            </a>
            <button
              onClick={() => setShowForm(true)}
              className="block bg-[#CBF7DA] text-black p-3 text-center rounded-xl hover:bg-[#b7eecb] transition-all duration-150"
            >
              Send me a quote
            </button>
          </div>
        </motion.div>
      )}

{showForm && !submitted && (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      if (formData[formFields[formStep].name].trim() === '') return;
      if (formStep < formFields.length - 1) {
        setFormStep((prev) => prev + 1);
      } else {
        setSubmitted(true);
      }
    }}
    className="bg-zinc-900 p-6 rounded-xl shadow space-y-4 mt-6"
  >
    <input
      type={formFields[formStep].name === 'email' ? 'email' : 'text'}
      name={formFields[formStep].name}
      placeholder={formFields[formStep].placeholder}
      value={formData[formFields[formStep].name]}
      onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
      required
      className="w-full border p-2 rounded bg-black border-white text-white"
    />
    <button
      type="submit"
      className="w-full bg-[#CBF7DA] text-black p-3 rounded-xl hover:bg-[#b7eecb] transition-all duration-150"
    >
      {formStep < formFields.length - 1 ? 'Next' : 'Submit'}
    </button>
  </form>
)}

      {submitted && (
        <div className="bg-zinc-900 p-6 rounded-xl shadow space-y-4 mt-6 text-center">
          <h2 className="text-xl font-bold">Thanks!</h2>
          <p>A member of our team will reach out shortly, but you can also:</p>
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-blue-600 text-white p-3 rounded-xl mt-3"
          >
            Book a Call
          </a>
        </div>
      )}
    </div>
  );
}
