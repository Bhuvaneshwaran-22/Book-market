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
    <div className="min-h-screen bg-gradient-dark text-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-slate-50 mb-2 animate-slide-down">List a Textbook</h1>
        <p className="text-lg text-slate-300 mb-8 animate-fade-in-delay-1">Help your classmates find the right book. Quick, verified, and trusted.</p>

        <form onSubmit={handleSubmit} className="glass-card-lg p-8 animate-slide-up space-y-8">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Complete all fields to list your book</span>
            {saving && <span className="animate-pulse">Saving…</span>}
          </div>

          {/* Academic Information Section */}
          <div className="animate-fade-in-delay-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-indigo-500/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 text-sm font-bold">
                1
              </div>
              <h2 className="text-lg font-semibold text-slate-50">Academic Information</h2>
            </div>
            <div className="space-y-5 pl-8">
              <div>
                <label className="block text-sm font-semibold text-slate-50 mb-1">Book Title</label>
                <p className="text-xs text-slate-400 mb-2">e.g., Algorithms: Design Manual, 4th Edition</p>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Full book title"
                  className="glass-input w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-50 mb-1">Subject Code</label>
                  <p className="text-xs text-slate-400 mb-2">e.g., CS101, MTH201</p>
                  <input
                    required
                    type="text"
                    value={form.subjectCode}
                    onChange={(e) => updateField('subjectCode', e.target.value)}
                    placeholder="Subject code"
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-50 mb-1">Department</label>
                  <p className="text-xs text-slate-400 mb-2">e.g., Computer Science</p>
                  <input
                    required
                    type="text"
                    value={form.department}
                    onChange={(e) => updateField('department', e.target.value)}
                    placeholder="Department"
                    className="glass-input w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-50 mb-1">Semester</label>
                <p className="text-xs text-slate-400 mb-2">e.g., Fall 2025, Semester 3</p>
                <input
                  required
                  type="text"
                  value={form.semester}
                  onChange={(e) => updateField('semester', e.target.value)}
                  placeholder="Semester"
                  className="glass-input w-full"
                />
              </div>
            </div>
          </div>

          {/* Exchange Details Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-emerald-500/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-sm font-bold">
                2
              </div>
              <h2 className="text-lg font-semibold text-slate-50">Exchange Details</h2>
            </div>
            <div className="space-y-5 pl-8">
              <div>
                <label className="block text-sm font-semibold text-slate-50 mb-1">Book Condition</label>
                <p className="text-xs text-slate-400 mb-2">Describe the current state (e.g., like new, light notes, well-used)</p>
                <input
                  required
                  type="text"
                  value={form.condition}
                  onChange={(e) => updateField('condition', e.target.value)}
                  placeholder="e.g., Light notes, no tears, highlighted chapters 3-5"
                  className="glass-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-50 mb-3">What are you doing with this book?</label>
                <div className="grid grid-cols-3 gap-3">
                  {['sell', 'lend', 'donate'].map(opt => (
                    <label 
                      key={opt} 
                      className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        form.intent === opt 
                          ? 'border-indigo-500/60 bg-indigo-500/20 font-semibold text-indigo-300' 
                          : 'border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
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
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
            <p className="text-sm text-emerald-300">
              <span className="font-semibold">✓ Campus Verified</span> – Your listing is only visible to verified students
            </p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={saving || !formComplete}
            className={`w-full text-lg py-3 rounded-lg font-semibold transition-all duration-200 ${
              saving || !formComplete
                ? 'bg-slate-900/40 text-slate-500 cursor-not-allowed border border-white/10'
                : 'btn-primary hover:scale-105 active:scale-95'
            }`}
          >
            {saving ? '📤 Posting your book…' : '+ Post to Campus Feed'}
          </button>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium animate-slide-down ${
              message.includes('✓') 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddBook;
