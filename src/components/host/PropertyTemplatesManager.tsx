import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  Plus, 
  Copy, 
  Trash2, 
  Check, 
  ArrowRight, 
  Building2, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  X,
  FileCheck,
  Smartphone
} from 'lucide-react';
import { PropertyTemplate, Property } from '../../types';
import { useApp } from '../../context/AppContext';

interface PropertyTemplatesManagerProps {
  onApplyTemplate?: (templateId: string) => void;
}

export const PropertyTemplatesManager: React.FC<PropertyTemplatesManagerProps> = ({
  onApplyTemplate
}) => {
  const { 
    templates, 
    addTemplate, 
    deleteTemplate, 
    properties, 
    applyTemplateToProperty, 
    showToast, 
    theme, 
    language 
  } = useApp();

  const isDark = theme === 'dark';
  const [selectedPreviewTemplate, setSelectedPreviewTemplate] = useState<PropertyTemplate | null>(null);
  const [applyingTemplate, setApplyingTemplate] = useState<PropertyTemplate | null>(null);
  const [targetPropertyId, setTargetPropertyId] = useState<string>(properties[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Template apply checkboxes
  const [applyOptions, setApplyOptions] = useState({
    rules: true,
    appliances: true,
    checkout: true,
    departureChecklist: true
  });

  // Create new template state
  const [newTemplateData, setNewTemplateData] = useState<Partial<PropertyTemplate>>({
    name: '',
    description: '',
    propertyType: 'apartment',
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    quietHours: '11:00 PM – 8:00 AM',
    trashSchedule: 'Municipal green bins on corner. Evening collection.',
    houseRules: [
      'No indoor smoking (balcony with ashtray is fine)',
      'Quiet courtyard hours after 11 PM',
      'Please take off shoes in the entrance'
    ],
    departureChecklist: [
      'Turn off AC remotes and lights',
      'Leave keys on dining table or inside lockbox',
      'Click entrance door firmly shut'
    ]
  });

  const handleCreateTemplate = () => {
    if (!newTemplateData.name?.trim()) {
      showToast(language === 'ka' ? 'გთხოვთ მიუთითოთ შაბლონის სახელი' : 'Please enter a template name');
      return;
    }

    addTemplate({
      name: newTemplateData.name,
      description: newTemplateData.description || 'Custom host property template',
      propertyType: newTemplateData.propertyType || 'apartment',
      checkInTime: newTemplateData.checkInTime || '3:00 PM',
      checkOutTime: newTemplateData.checkOutTime || '11:00 AM',
      quietHours: newTemplateData.quietHours || '11:00 PM – 8:00 AM',
      trashSchedule: newTemplateData.trashSchedule || 'Municipal bins.',
      houseRules: newTemplateData.houseRules || [],
      departureChecklist: newTemplateData.departureChecklist || [],
      appliances: []
    });

    setIsCreatingNew(false);
  };

  const handleCloneFromProperty = (property: Property) => {
    addTemplate({
      name: `${property.title} Template`,
      description: `Cloned from ${property.title} (${property.city})`,
      propertyType: property.type,
      checkInTime: property.checkInTime,
      checkOutTime: property.checkOutTime,
      quietHours: property.quietHours,
      trashSchedule: property.trashSchedule,
      houseRules: [...property.houseRules],
      departureChecklist: [...(property.departureChecklist || [])],
      appliances: property.appliances.map(a => ({ ...a }))
    });
    showToast(
      language === 'ka' 
        ? `შაბლონი შეიქმნა "${property.title}"-სგან` 
        : `Created template from "${property.title}"`
    );
  };

  const handleConfirmApply = () => {
    if (!applyingTemplate || !targetPropertyId) return;

    applyTemplateToProperty(targetPropertyId, applyingTemplate.id, applyOptions);
    if (onApplyTemplate) {
      onApplyTemplate(applyingTemplate.id);
    }
    setApplyingTemplate(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? 'bg-[#181716] border-[#2B2926] text-[#F7F5F0]' : 'bg-[#FBF9F6] border-[#EBE6DF] text-[#1C1B1A]'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg">
              {language === 'ka' ? 'ბინის მრავალჯერადი შაბლონები' : 'Reusable Property Templates'}
            </span>
            <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full border ${
              isDark ? 'bg-amber-950/40 text-amber-300 border-amber-800/50' : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {templates.length} {language === 'ka' ? 'შაბლონი' : 'templates'}
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>
            {language === 'ka'
              ? 'თუ რამდენიმე ბინას მართავთ, აღარ გჭირდებათ წესებისა და ინსტრუქციების ხელახლა აკრეფა. გამოიყენეთ მასტერ-შაბლონი 1 წამში.'
              : 'Never re-type house rules, checkout instructions, or appliance guides. Apply master templates across all your apartments in 1 click.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="dropdown relative">
            <button
              type="button"
              onClick={() => {
                if (properties[0]) handleCloneFromProperty(properties[0]);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-2xs ${
                isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-750' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Copy className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'ka' ? 'ბინისგან კლონირება' : 'Clone Active Property'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCreatingNew(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#B85D3B] hover:bg-[#A35132] text-white transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'ka' ? 'ახალი შაბლონი' : 'Create Template'}</span>
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((tmpl) => {
          const ruleCount = (tmpl.houseRules || []).length;
          const applianceCount = (tmpl.appliances || []).length;

          return (
            <div
              key={tmpl.id}
              className={`p-5 rounded-2xl border transition-all shadow-xs flex flex-col justify-between ${
                isDark ? 'bg-[#181716] border-[#2B2926]' : 'bg-white border-stone-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/50 dark:border-amber-800/40">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedPreviewTemplate(tmpl)}
                      title="Preview template"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {templates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteTemplate(tmpl.id)}
                        title="Delete template"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-zinc-100">
                    {tmpl.name}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                {/* Key specs */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-zinc-800/80 text-[11px] text-stone-600 dark:text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 dark:text-zinc-500">Check-in / out</span>
                    <span className="font-mono font-medium">{tmpl.checkInTime} / {tmpl.checkOutTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 dark:text-zinc-500">House rules</span>
                    <span className="font-mono font-medium">{ruleCount} items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 dark:text-zinc-500">Visual how-tos</span>
                    <span className="font-mono font-medium">{applianceCount} items</span>
                  </div>
                </div>
              </div>

              {/* Bottom Apply Action */}
              <div className="pt-4 mt-4 border-t border-stone-100 dark:border-zinc-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setApplyingTemplate(tmpl)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-[#B85D3B] hover:bg-[#A35132] text-white flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{language === 'ka' ? 'ბინაზე მორგება' : 'Apply to Property'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Template Modal */}
      <AnimatePresence>
        {selectedPreviewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`max-w-xl w-full max-h-[85vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${
                isDark ? 'bg-[#181716] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-stone-200 text-stone-900'
              }`}
            >
              <div className="p-5 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg">{selectedPreviewTemplate.name}</h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400">{selectedPreviewTemplate.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewTemplate(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-zinc-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
                {/* Hours & Schedule */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800">
                  <div>
                    <span className="text-stone-400 block font-mono text-[10px]">CHECK-IN / OUT</span>
                    <span className="font-semibold text-sm">{selectedPreviewTemplate.checkInTime} – {selectedPreviewTemplate.checkOutTime}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-mono text-[10px]">QUIET HOURS</span>
                    <span className="font-semibold text-sm">{selectedPreviewTemplate.quietHours}</span>
                  </div>
                </div>

                {/* House Rules */}
                <div className="space-y-1.5">
                  <h5 className="font-semibold text-stone-800 dark:text-zinc-200">House Rules Included:</h5>
                  <ul className="space-y-1">
                    {selectedPreviewTemplate.houseRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-stone-600 dark:text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Departure Checklist */}
                {selectedPreviewTemplate.departureChecklist && (
                  <div className="space-y-1.5">
                    <h5 className="font-semibold text-stone-800 dark:text-zinc-200">Departure Checkout Checklist:</h5>
                    <ul className="space-y-1">
                      {selectedPreviewTemplate.departureChecklist.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-stone-600 dark:text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bundled Appliances */}
                <div className="space-y-1.5">
                  <h5 className="font-semibold text-stone-800 dark:text-zinc-200">
                    Bundled Visual Instructions ({(selectedPreviewTemplate.appliances || []).length}):
                  </h5>
                  <div className="space-y-1.5">
                    {(selectedPreviewTemplate.appliances || []).map((app, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                        <span className="font-medium">{app.title}</span>
                        <span className="text-[10px] text-stone-400 capitalize">{app.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const tmpl = selectedPreviewTemplate;
                    setSelectedPreviewTemplate(null);
                    setApplyingTemplate(tmpl);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#B85D3B] hover:bg-[#A35132] text-white"
                >
                  {language === 'ka' ? 'ამ შაბლონის გამოყენება' : 'Use This Template'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Apply Template Dialog */}
      <AnimatePresence>
        {applyingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`max-w-md w-full rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${
                isDark ? 'bg-[#181716] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-stone-200 text-stone-900'
              }`}
            >
              <div className="p-5 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg">
                    {language === 'ka' ? 'შაბლონის გამოყენება' : 'Apply Template'}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400">
                    "{applyingTemplate.name}"
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setApplyingTemplate(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-zinc-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                {/* Select Target Property */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700 dark:text-zinc-300">
                    {language === 'ka' ? 'სამიზნე ბინა' : 'Target Property'}
                  </label>
                  <select
                    value={targetPropertyId}
                    onChange={(e) => setTargetPropertyId(e.target.value)}
                    className={`w-full text-xs font-medium px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.city})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Import checkboxes */}
                <div className="space-y-2">
                  <label className="font-semibold text-stone-700 dark:text-zinc-300">
                    {language === 'ka' ? 'რა ელემენტები გადმოვიდეს?' : 'Select Elements to Import:'}
                  </label>

                  <div className="space-y-2 p-3 rounded-xl bg-stone-50 dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-800">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyOptions.rules}
                        onChange={(e) => setApplyOptions({ ...applyOptions, rules: e.target.checked })}
                        className="rounded accent-[#B85D3B]"
                      />
                      <span>House Rules, Quiet Hours & Trash Schedule</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyOptions.appliances}
                        onChange={(e) => setApplyOptions({ ...applyOptions, appliances: e.target.checked })}
                        className="rounded accent-[#B85D3B]"
                      />
                      <span>Visual Appliance Instructions ({(applyingTemplate.appliances || []).length} guides)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyOptions.checkout}
                        onChange={(e) => setApplyOptions({ ...applyOptions, checkout: e.target.checked })}
                        className="rounded accent-[#B85D3B]"
                      />
                      <span>Checkout Time ({applyingTemplate.checkOutTime})</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyOptions.departureChecklist}
                        onChange={(e) => setApplyOptions({ ...applyOptions, departureChecklist: e.target.checked })}
                        className="rounded accent-[#B85D3B]"
                      />
                      <span>Departure Checkout Checklist</span>
                    </label>
                  </div>
                </div>

                {/* Safety notice */}
                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    <strong>Non-destructive:</strong> Your unique door codes, Wi-Fi password, and property address remain completely untouched.
                  </span>
                </div>
              </div>

              <div className="p-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApplyingTemplate(null)}
                  className="px-4 py-2 text-xs font-medium rounded-xl border border-stone-200 dark:border-zinc-700"
                >
                  {language === 'ka' ? 'გაუქმება' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApply}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#B85D3B] hover:bg-[#A35132] text-white shadow-sm"
                >
                  {language === 'ka' ? 'შაბლონის მორგება' : 'Apply Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create New Template Modal */}
      <AnimatePresence>
        {isCreatingNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className={`max-w-xl w-full max-h-[85vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${
                isDark ? 'bg-[#181716] border-[#2B2926] text-[#F7F5F0]' : 'bg-white border-stone-200 text-stone-900'
              }`}
            >
              <div className="p-5 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg">
                  {language === 'ka' ? 'ახალი მასტერ-შაბლონის შექმნა' : 'Create Master Property Template'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-zinc-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-zinc-300">Template Name</label>
                  <input
                    type="text"
                    value={newTemplateData.name}
                    onChange={(e) => setNewTemplateData({ ...newTemplateData, name: e.target.value })}
                    placeholder="e.g. Standard City Studio Template"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-zinc-300">Description</label>
                  <input
                    type="text"
                    value={newTemplateData.description}
                    onChange={(e) => setNewTemplateData({ ...newTemplateData, description: e.target.value })}
                    placeholder="Brief note about when to use this template..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700 dark:text-zinc-300">Check-in Time</label>
                    <input
                      type="text"
                      value={newTemplateData.checkInTime}
                      onChange={(e) => setNewTemplateData({ ...newTemplateData, checkInTime: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700 dark:text-zinc-300">Check-out Time</label>
                    <input
                      type="text"
                      value={newTemplateData.checkOutTime}
                      onChange={(e) => setNewTemplateData({ ...newTemplateData, checkOutTime: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-zinc-300">Quiet Hours</label>
                  <input
                    type="text"
                    value={newTemplateData.quietHours}
                    onChange={(e) => setNewTemplateData({ ...newTemplateData, quietHours: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl border border-stone-200 dark:border-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateTemplate}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#B85D3B] hover:bg-[#A35132] text-white shadow-sm"
                >
                  Create Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
