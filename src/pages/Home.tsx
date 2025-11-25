import { FormEvent, useMemo, useState } from 'react';
import { DishCard } from '../components/DishCard';
import { dishes } from '../data/dishes';
import { appsScriptConfig } from '../config';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const description = [
  'We are gathering on the longest night of the year for a cozy potluck-style Yalda dinner. Choose the dishes that you will bring so everyone can coordinate and no one over-cooks!',
  'One dish per household is totally fine, but feel free to bring more if you want. Drinks and desserts are welcome too. Please submit the form once per household so we can keep the spreadsheet organized.',
];

export default function Home() {
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [selectedDishIds, setSelectedDishIds] = useState<number[]>([]);
  const [status, setStatus] = useState<SubmissionState>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const { endpoint, configured } = appsScriptConfig;

  const selectedDishNames = useMemo(
    () =>
      selectedDishIds
        .map((dishId) => dishes.find((dish) => dish.id === dishId)?.en)
        .filter(Boolean)
        .join(', '),
    [selectedDishIds],
  );

  const toggleDish = (dishId: number) => {
    setSelectedDishIds((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setMessage('Please share your name before submitting.');
      return;
    }

    if (!selectedDishIds.length) {
      setMessage('Please choose at least one dish.');
      return;
    }

    if (!configured || !endpoint) {
      setMessage('Apps Script endpoint is missing. Ask the organizer to add it to the .env file.');
      return;
    }

    const payload = {
      name: name.trim(),
      partner: partnerName.trim(),
      selectedDishes: selectedDishNames,
    };

    try {
      setStatus('submitting');
      setMessage('Sending your RSVP...');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Apps Script rejected the submission');
      }

      setStatus('success');
      setMessage('Thanks! Your dish selection has been shared.');
      setSelectedDishIds([]);
      setPartnerName('');
      setName('');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Could not submit the form. Please try again in a moment.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <header className="text-center space-y-2">
        <p className="text-rose-500 text-sm font-semibold uppercase tracking-wide">Yalda Party</p>
        <h1 className="text-3xl font-semibold text-gray-900">Food Selection Form</h1>
        <p className="text-gray-600 text-sm">
          Fill out the form below and coordinate what you will bring to dinner.
        </p>
      </header>

      <div className="mt-8 bg-gray-50 border border-gray-200 p-4 rounded-md text-sm leading-6 text-gray-700 space-y-3">
        {description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="text-gray-500">
          Need to double-check existing selections?{' '}
          <a className="underline text-rose-500" href="/results">
            View the live list
          </a>
          .
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <section>
          <h2 className="text-base font-semibold text-gray-900">Dishes</h2>
          <p className="text-sm text-gray-600">Pick one or more dishes you will prepare.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                checked={selectedDishIds.includes(dish.id)}
                onToggle={toggleDish}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4">
          <label className="text-sm text-gray-700">
            Your Name<span className="text-rose-500">*</span>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="text-sm text-gray-700">
            Partner / +1 name (optional)
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              value={partnerName}
              onChange={(event) => setPartnerName(event.target.value)}
              placeholder="e.g. Vida"
            />
          </label>
        </section>

        {message && (
          <div
            className={`text-sm rounded-md px-3 py-2 ${
              status === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : status === 'error'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-md py-2 text-sm font-medium transition-colors disabled:opacity-60"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </form>
    </div>
  );
}
