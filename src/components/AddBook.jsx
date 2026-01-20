import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseApp';

const defaultForm = {
  title: '',
  subjectCode: '',
  department: '',
  semester: '',
  condition: '',
  intent: 'sell',
};

const AddBook = ({ user, showToast }) => {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const formComplete = Boolean(
    form.title &&
    form.subjectCode &&
    form.department &&
    form.semester &&
    form.condition &&
    form.intent
  );

  const updateField = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    try {
      await addDoc(collection(db, 'books'), {
        ...form,
        ownerId: user.uid,
        ownerEmail: user.email,
        status: 'available',
        createdAt: serverTimestamp(),
      });
      setForm(defaultForm);
      setMessage('✓ Book posted! Your campus community can now see it.');
      showToast?.('Book added to the campus feed');
    } catch (err) {
      setMessage(err.message || 'Could not save book.');
      showToast?.('Unable to save the book right now.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-light text-slate-900 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 animate-slide-down">List a Textbook</h1>
        <p className="text-lg text-slate-600 mb-8 animate-fade-in-delay-1">Help your classmates find the right book at the right price.</p>

        <form onSubmit={handleSubmit} className="glass-card-lg p-8 animate-slide-up hover-glow transition-smooth-lg space-y-6">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Complete the fields to enable posting.</span>
            {saving && <span className="animate-pulse">Saving…</span>}
          </div>

          {/* Academic Information Section */}
          <div className="mb-8 animate-fade-in-delay-1">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">📚</span>
              Academic Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">Title</label>
                <p className="text-xs text-slate-600 mb-2">e.g., Algorithms: Design Manual, 4th Edition</p>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Full book title"
                  className="glass-input-lg w-full hover-glow focus:shadow-lg focus:shadow-indigo-500/30 transition duration-150"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">Subject Code</label>
                  <p className="text-xs text-slate-600 mb-2">e.g., CS101</p>
                  <input
                    required
                    type="text"
                    value={form.subjectCode}
                    onChange={(e) => updateField('subjectCode', e.target.value)}
                    placeholder="CS101"
                    className="glass-input-lg w-full hover-glow transition duration-150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">Department</label>
                  <p className="text-xs text-slate-600 mb-2">e.g., Computer Science</p>
                  <input
                    required
                    type="text"
                    value={form.department}
                    onChange={(e) => updateField('department', e.target.value)}
                    placeholder="Department"
                    className="glass-input w-full transition duration-150"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">Semester</label>
                <p className="text-xs text-slate-600 mb-2">e.g., Fall 2025, Semester 3</p>
                <input
                  required
                  type="text"
                  value={form.semester}
                  onChange={(e) => updateField('semester', e.target.value)}
                  placeholder="Fall 2025"
                  className="glass-input w-full transition duration-150"
                />
              </div>
            </div>
          </div>

          {/* Exchange Details Section */}
          <div className="mb-8 border-t border-slate-200 pt-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">🤝</span>
              Exchange Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">Condition</label>
                <p className="text-xs text-slate-600 mb-2">Describe the book's state (e.g., like new, light notes, well-used)</p>
                <input
                  required
                  type="text"
                  value={form.condition}
                  onChange={(e) => updateField('condition', e.target.value)}
                  placeholder="Light notes, no tears, highlighted chapters 3-5"
                  className="glass-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">What are you doing with this book?</label>
                <p className="text-xs text-slate-600 mb-3">How do you want to exchange it?</p>
                <div className="grid grid-cols-3 gap-3">
                  {['sell', 'lend', 'donate'].map(opt => (
                    <label key={opt} className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      form.intent === opt 
                        ? 'border-indigo-500 bg-indigo-500/10 font-semibold text-indigo-300' 
                        : 'border-white/60 text-slate-600 hover:border-indigo-200'
                    }`}>
                      <input
                        type="radio"
                        name="intent"
                        value={opt}
                        checked={form.intent === opt}
                        onChange={(e) => updateField('intent', e.target.value)}
                        className="sr-only"
                      />
                      <span className="capitalize">{opt === 'sell' ? '💵 Sell' : opt === 'lend' ? '🔄 Lend' : '❤️ Donate'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mb-8 p-4 bg-indigo-500/10 border border-indigo-300/40 rounded-lg">
            <p className="text-sm text-indigo-700">
              <span className="font-semibold">✓ Verified Campus Only</span> – Only students with .edu/.com/gmail.com emails can see your listing.
            </p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={saving || !formComplete}
            className={`w-full text-lg py-3 rounded-lg font-semibold transition duration-150 ${
              saving || !formComplete
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'btn-primary hover:scale-105 active:scale-95'
            }`}
          >
            {saving ? 'Posting your book…' : '+ Post to Campus Feed'}
          </button>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              message.includes('✓') 
                ? 'bg-green-500/10 text-green-700 border border-green-300' 
                : 'bg-red-500/10 text-red-700 border border-red-300'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddBook;
