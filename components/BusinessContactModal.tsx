import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type BusinessContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tierName?: string;
};

export const BusinessContactModal = ({
  isOpen,
  onClose,
  tierName,
}: BusinessContactModalProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    companyEmail: "",
    phone: "",
    expectedMemberships: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateEmail = (email: string) => {
    const forbiddenDomains = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"];
    const domain = email.split("@")[1]?.toLowerCase();
    if (domain && forbiddenDomains.includes(domain)) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.companyEmail)) {
      setError("Please use a company email address (no Gmail, Outlook, or Yahoo).");
      return;
    }

    // Submit logic here (e.g., API call)
    console.log("Business contact submitted:", { ...formData, tierName });
    setSuccess(true);

    // Reset form after delay
    setTimeout(() => {
      onClose();
      setSuccess(false);
      setFormData({
        firstName: "",
        lastName: "",
        companyName: "",
        companyEmail: "",
        phone: "",
        expectedMemberships: "",
      });
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-brand-black border border-brand-gold/20 p-8 shadow-2xl"
            >
              <button
                onClick={onClose}
                className="absolute right-6 top-6 text-brand-gray hover:text-brand-ivory"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {success ? (
                <div className="text-center py-10">
                  <h3 className="text-2xl font-semibold text-brand-gold mb-4">Thank You</h3>
                  <p className="text-brand-ivory">We have received your inquiry and will be in touch shortly.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl font-semibold text-brand-ivory">Business Inquiry</h2>
                    {tierName && <p className="text-brand-gold mt-2 uppercase tracking-widest text-xs">For {tierName}</p>}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-xs uppercase tracking-wider text-brand-lightBlue">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full rounded-lg bg-brand-deepBlue/20 border border-brand-deepBlue/40 px-4 py-3 text-brand-ivory focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-xs uppercase tracking-wider text-brand-lightBlue">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full rounded-lg bg-brand-deepBlue/20 border border-brand-deepBlue/40 px-4 py-3 text-brand-ivory focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="companyName" className="text-xs uppercase tracking-wider text-brand-lightBlue">Company Name</label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full rounded-lg bg-brand-deepBlue/20 border border-brand-deepBlue/40 px-4 py-3 text-brand-ivory focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="companyEmail" className="text-xs uppercase tracking-wider text-brand-lightBlue">Company Email</label>
                      <input
                        type="email"
                        id="companyEmail"
                        name="companyEmail"
                        required
                        value={formData.companyEmail}
                        onChange={handleChange}
                        className="w-full rounded-lg bg-brand-deepBlue/20 border border-brand-deepBlue/40 px-4 py-3 text-brand-ivory focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs uppercase tracking-wider text-brand-lightBlue">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg bg-brand-deepBlue/20 border border-brand-deepBlue/40 px-4 py-3 text-brand-ivory focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="expectedMemberships" className="text-xs uppercase tracking-wider text-brand-lightBlue">Expected Membership Numbers</label>
                      <input
                        type="number"
                        id="expectedMemberships"
                        name="expectedMemberships"
                        required
                        min="1"
                        value={formData.expectedMemberships}
                        onChange={handleChange}
                        className="w-full rounded-lg bg-brand-deepBlue/20 border border-brand-deepBlue/40 px-4 py-3 text-brand-ivory focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      className="mt-4 w-full rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold uppercase tracking-widest text-brand-black hover:bg-brand-ivory transition-colors"
                    >
                      Submit Inquiry
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};







