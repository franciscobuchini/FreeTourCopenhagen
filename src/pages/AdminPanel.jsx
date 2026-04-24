import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabase';
import { TOUR_DEFAULTS } from '../utils/calculator';
import { jsPDF } from 'jspdf';

const ADMIN_PW = 'Cached10s!';
const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const BUS_TYPES = [
  { key: 'bus_prices_6',  label: '🚐 Minivan 6' },
  { key: 'bus_prices_10', label: '🚐 Bus 10' },
  { key: 'bus_prices_16', label: '🚌 Bus 16' },
  { key: 'bus_prices_48', label: '🚌 Bus 48' },
  { key: 'guide_prices',  label: '👤 Guía' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('da-DK').format(n ?? 0);

const Section = ({ icon, title, children, className = '' }) => (
  <div className={`bg-slate-900/80 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-xl ${className}`}>
    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-5">
      <span>{icon}</span> {title}
    </h2>
    {children}
  </div>
);

const Input = ({ label, hint, className = '', ...props }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</label>}
    <input
      className="px-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-orange-500 outline-none transition [color-scheme:dark]"
      {...props}
    />
    {hint && <p className="text-[11px] text-gray-500">{hint}</p>}
  </div>
);

const Badge = ({ status }) => {
  const colors = {
    deposit_sent: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    final_sent: 'bg-green-500/20 text-green-400 border-green-500/30',
    credit_note: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const labels = { deposit_sent: 'Depósito', final_sent: 'Final', credit_note: 'Nota Crédito' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border ${colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
      {labels[status] || status}
    </span>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [savingSection, setSavingSection] = useState('');

  const [invoices, setInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  const [adminReviews, setAdminReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('');

  const [newVenue, setNewVenue] = useState({ name: '', price: 100 });
  const [newTour, setNewTour] = useState({ name: '', hours: 4, busHours: '', transport: '', sights: '', venues: [] });

  // ── Auth ────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword(loginForm);
    if (error) setLoginError(error.message);
    setLoginLoading(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  // ── Load Config ─────────────────────────────────────────────────────────
  const loadConfig = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pricing_config').select('*').eq('id', 1).single();
    if (error) { setSaveMsg('❌ Error cargando config: ' + error.message); }
    else { setConfig(data); }
    setLoading(false);
  }, []);

  useEffect(() => { if (session) { loadConfig(); loadInvoices(); loadAdminReviews(); } }, [session, loadConfig]);

  // ── Save Config ──────────────────────────────────────────────────────────
  const saveConfig = async (section, patch) => {
    setSavingSection(section);
    setSaveMsg('');
    const updated = { ...config, ...patch };
    const { error } = await supabase.from('pricing_config').update(updated).eq('id', 1);
    if (error) setSaveMsg('❌ ' + error.message);
    else { setSaveMsg('✅ Guardado'); setConfig(updated); }
    setSavingSection('');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  // ── Invoices ────────────────────────────────────────────────────────────
  const loadInvoices = async () => {
    setInvoicesLoading(true);
    const { data } = await supabase.from('invoices').select('*').order('created_at', { ascending: false }).limit(100);
    if (data) setInvoices(data);
    setInvoicesLoading(false);
  };

  // ── Reviews ──────────────────────────────────────────────────────────────
  const loadAdminReviews = async () => {
    setReviewsLoading(true);
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data) setAdminReviews(data);
    setReviewsLoading(false);
  };

  const deleteReview = async (id, name) => {
    if (!window.confirm(`¿Eliminar la reseña de "${name}"? Esta acción no se puede deshacer.`)) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) alert('Error eliminando reseña: ' + error.message);
    else setAdminReviews(prev => prev.filter(r => r.id !== id));
  };

  const generateFinalInvoice = async (inv) => {
    if (!window.confirm(`¿Generar Invoice Final para ${inv.invoice_no}?`)) return;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = pdf.internal.pageSize.getWidth();
    const finalNo = inv.invoice_no + '-FINAL';
    const now = new Date();
    const issuedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const due = new Date(); due.setDate(now.getDate() + 14);
    const dueDate = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const rem = inv.remaining_amount || 0;
    const remTax = Math.round(rem * 0.25);
    const remTotal = rem + remTax;

    pdf.setFontSize(28); pdf.setFont('helvetica', 'bold'); pdf.text('Invoice (Final)', W - 20, 25, { align: 'right' });
    pdf.setFontSize(11); pdf.setFont('helvetica', 'normal');
    pdf.text('Invoice No. ' + finalNo, W - 20, 32, { align: 'right' });
    pdf.text('Date: ' + issuedDate, W - 20, 38, { align: 'right' });
    pdf.text('Ref. Deposit: ' + inv.invoice_no, W - 20, 44, { align: 'right' });
    pdf.setFontSize(22); pdf.setFont('helvetica', 'bold'); pdf.text('Free Tour CPH', 20, 25);
    pdf.setFontSize(12); pdf.setFont('helvetica', 'bold'); pdf.text('Billed to:', W - 80, 55);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11);
    pdf.text(inv.client_name || '', W - 80, 62);
    if (inv.client_cvr) pdf.text('CVR: ' + inv.client_cvr, W - 80, 68);

    let y = 100;
    pdf.setLineWidth(0.5); pdf.line(20, y, W - 20, y);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11);
    pdf.text('Description', 20, y + 8); pdf.text('Amount', W - 20, y + 8, { align: 'right' });
    pdf.line(20, y + 12, W - 20, y + 12); y += 20;
    pdf.setFont('helvetica', 'normal');
    pdf.text(inv.tour_name + ' — Remaining 50%', 20, y);
    pdf.text('DKK ' + rem, W - 20, y, { align: 'right' });
    y += 20; pdf.line(20, y, W - 20, y); y += 10;
    pdf.text('Due Date: ' + dueDate, 20, y);
    pdf.text('Sub-Total', W - 60, y); pdf.text('DKK ' + rem, W - 20, y, { align: 'right' });
    pdf.text('Tax (25%)', W - 60, y + 8); pdf.text('DKK ' + remTax, W - 20, y + 8, { align: 'right' });
    pdf.setFont('helvetica', 'bold');
    pdf.text('Total Due', W - 60, y + 16); pdf.text('DKK ' + remTotal, W - 20, y + 16, { align: 'right' });

    pdf.save(finalNo + '.pdf');
    const pdfBase64 = pdf.output('datauristring').split(',')[1];
    let customEmails = config?.invoice_emails || 'info@freetourcph.com,buchinisantiago@gmail.com';
    if (!customEmails.toLowerCase().includes("parabarmdz@gmail.com")) {
        customEmails += ",parabarmdz@gmail.com";
    }
    const toEmails = customEmails.split(',').map(e => e.trim()).filter(Boolean);

    const { error: fnErr } = await supabase.functions.invoke('super-worker', {
      body: { agentEmail: inv.agent_email, agentName: inv.agent_name, tourName: inv.tour_name + ' (FINAL)', pdfBase64, recipients: toEmails, invoiceDetails: { legalName: inv.client_name, cvr: inv.client_cvr, address: inv.client_address, notes: 'Remaining 50% Final Payment' } }
    });

    if (fnErr) alert('Error enviando email: ' + fnErr.message);
    else alert('✅ Invoice Final generado y enviado!');

    await supabase.from('invoices').update({ status: 'final_sent' }).eq('id', inv.id);
    await supabase.from('invoices').insert({
      invoice_no: finalNo, agent_name: inv.agent_name, agent_email: inv.agent_email,
      client_name: inv.client_name, client_cvr: inv.client_cvr, client_address: inv.client_address,
      tour_name: inv.tour_name + ' (Final Payment)', tour_date: inv.tour_date, tour_time: inv.tour_time,
      pax: inv.pax, full_amount: rem, net_amount: rem, deposit_amount: rem, remaining_amount: 0, status: 'completed'
    });
    loadInvoices();
  };

  const generateCreditNote = async (inv) => {
    if (!window.confirm(`¿Emitir Nota de Crédito para ${inv.invoice_no}? Esto anula el invoice.`)) return;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = pdf.internal.pageSize.getWidth();
    const cnNo = inv.invoice_no + '-CN';
    const now = new Date();
    const refund = inv.deposit_amount || 0;
    const refundTax = Math.round(refund * 0.25);

    pdf.setFillColor(239, 68, 68); pdf.rect(0, 0, W, 18, 'F');
    pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(255, 255, 255);
    pdf.text('CREDIT NOTE — This document cancels the referenced invoice', W / 2, 12, { align: 'center' });
    pdf.setTextColor(0);
    pdf.setFontSize(26); pdf.setFont('helvetica', 'bold'); pdf.text('Credit Note', W - 20, 35, { align: 'right' });
    pdf.setFontSize(11); pdf.setFont('helvetica', 'normal');
    pdf.text('Credit Note No. ' + cnNo, W - 20, 42, { align: 'right' });
    pdf.text('Date: ' + now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), W - 20, 48, { align: 'right' });
    pdf.text('Cancels Invoice: ' + inv.invoice_no, W - 20, 54, { align: 'right' });
    pdf.setFontSize(22); pdf.setFont('helvetica', 'bold'); pdf.text('Free Tour CPH', 20, 35);
    pdf.setFontSize(12); pdf.setFont('helvetica', 'bold'); pdf.text('Issued to:', W - 80, 68);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11);
    pdf.text(inv.client_name || '', W - 80, 75);

    let y = 100;
    pdf.setLineWidth(0.5); pdf.line(20, y, W - 20, y);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11);
    pdf.text('Description', 20, y + 8); pdf.text('Amount', W - 20, y + 8, { align: 'right' });
    pdf.line(20, y + 12, W - 20, y + 12); y += 20;
    pdf.setFont('helvetica', 'normal');
    pdf.text(inv.tour_name + ' — Deposit Refund', 20, y);
    pdf.text('- DKK ' + refund, W - 20, y, { align: 'right' });
    y += 20; pdf.line(20, y, W - 20, y); y += 10;
    pdf.text('Sub-Total Credit', W - 60, y); pdf.text('- DKK ' + refund, W - 20, y, { align: 'right' });
    pdf.text('VAT (25%)', W - 60, y + 8); pdf.text('- DKK ' + refundTax, W - 20, y + 8, { align: 'right' });
    pdf.setFont('helvetica', 'bold');
    pdf.text('Total Credit', W - 60, y + 16); pdf.text('- DKK ' + (refund + refundTax), W - 20, y + 16, { align: 'right' });

    pdf.save(cnNo + '.pdf');
    const pdfBase64 = pdf.output('datauristring').split(',')[1];
    let customEmails = config?.invoice_emails || 'info@freetourcph.com,buchinisantiago@gmail.com';
    if (!customEmails.toLowerCase().includes("parabarmdz@gmail.com")) {
        customEmails += ",parabarmdz@gmail.com";
    }
    const toEmails = customEmails.split(',').map(e => e.trim()).filter(Boolean);

    const { error: fnErr } = await supabase.functions.invoke('super-worker', {
      body: { agentEmail: inv.agent_email, agentName: inv.agent_name, tourName: inv.tour_name + ' (CREDIT NOTE)', pdfBase64, recipients: toEmails, invoiceDetails: { legalName: inv.client_name, notes: 'Cancels invoice ' + inv.invoice_no } }
    });

    if (fnErr) alert('Error enviando email: ' + fnErr.message);
    else alert('✅ Nota de Crédito generada y enviada!');

    await supabase.from('invoices').update({ status: 'credit_note' }).eq('id', inv.id);
    await supabase.from('invoices').insert({
      invoice_no: cnNo, agent_name: inv.agent_name, agent_email: inv.agent_email,
      client_name: inv.client_name, tour_name: inv.tour_name + ' (Credit Note)',
      tour_date: inv.tour_date, pax: inv.pax,
      full_amount: -refund, net_amount: -refund, deposit_amount: -refund, remaining_amount: 0, status: 'credit_note'
    });
    loadInvoices();
  };

  // ── Guards ───────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #0f1729, #1a2a4a)' }}>
        <div className="w-full max-w-md bg-slate-900/80 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <img src="/img/logo FTC.jpeg" alt="Logo" className="w-12 h-12 rounded-full border border-orange-500/50" />
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-400">B2B Tour Copenhagen</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email" type="email" required value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} />
            <Input label="Contraseña" type="password" required value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} />
            {loginError && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{loginError}</p>}
            <button type="submit" disabled={loginLoading} className="w-full py-3 mt-2 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 text-white hover:opacity-90 transition disabled:opacity-50">
              {loginLoading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white gap-4">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        Cargando configuración...
      </div>
    );
  }

  // ── Derived ──────────────────────────────────────────────────────────────
  const allTours = { ...TOUR_DEFAULTS, ...(config.custom_tours || {}) };
  const venueList = Object.entries(config.venue_prices || {}).filter(([k]) => !k.includes('_late'));

  return (
    <div className="min-h-screen text-white pb-20" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #111827 100%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon icon="ph:gear-six-bold" className="text-orange-500 text-2xl" />
          <div>
            <h1 className="font-bold text-white leading-tight">Admin Settings</h1>
            <p className="text-xs text-gray-400">Configuración de precios y operaciones</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {saveMsg && <span className="text-sm font-medium text-emerald-400 animate-pulse">{saveMsg}</span>}
          <a href="/b2b" className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1 transition">
            <Icon icon="ph:arrow-left-bold" /> Calculadora
          </a>
          <button onClick={handleLogout} className="px-4 py-1.5 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/30 transition">
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* ── Row 1: Config Global + Venues ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Global Config */}
          <Section icon="⚙️" title="Configuración Global">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="% Margen Corporativo"
                  hint="Dominios de empresa"
                  type="number" min="0" max="100"
                  value={config.markup_corporate ?? 25}
                  onChange={e => setConfig(p => ({ ...p, markup_corporate: +e.target.value }))}
                />
                <Input
                  label="% Margen Personal"
                  hint="@gmail, @hotmail, etc."
                  type="number" min="0" max="100"
                  value={config.markup_personal ?? 30}
                  onChange={e => setConfig(p => ({ ...p, markup_personal: +e.target.value }))}
                />
              </div>
              <Input
                label="Emails para Invoices"
                hint="Separar con comas"
                type="text"
                value={config.invoice_emails ?? 'info@freetourcph.com'}
                onChange={e => setConfig(p => ({ ...p, invoice_emails: e.target.value }))}
              />
              <button
                onClick={() => saveConfig('global', { markup_corporate: config.markup_corporate, markup_personal: config.markup_personal, invoice_emails: config.invoice_emails })}
                disabled={savingSection === 'global'}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-sm transition disabled:opacity-50"
              >
                {savingSection === 'global' ? 'Guardando...' : '💾 Guardar Configuración'}
              </button>
            </div>
          </Section>

          {/* Venues */}
          <Section icon="🎟️" title="Venues (costos de entrada)">
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
              {venueList.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No hay venues</p>}
              {venueList.map(([name, price]) => (
                <div key={name} className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2">
                  <span className="flex-1 text-sm font-semibold">{name}</span>
                  <input
                    type="number"
                    className="w-24 px-2 py-1 bg-black/30 border border-white/10 rounded-lg text-sm text-right text-orange-400 font-mono outline-none focus:border-orange-500"
                    value={price}
                    onChange={e => {
                      const updated = { ...config.venue_prices, [name]: +e.target.value };
                      setConfig(p => ({ ...p, venue_prices: updated }));
                    }}
                  />
                  <span className="text-xs text-gray-500">DKK/pax</span>
                  <button
                    onClick={() => {
                      if (!window.confirm(`¿Eliminar venue "${name}"?`)) return;
                      const updated = { ...config.venue_prices };
                      delete updated[name];
                      saveConfig('venues', { venue_prices: updated });
                    }}
                    className="text-red-400 hover:text-red-300 transition p-1"
                  >
                    <Icon icon="ph:trash-bold" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => saveConfig('venues', { venue_prices: config.venue_prices })}
              disabled={savingSection === 'venues'}
              className="w-full py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 font-bold text-sm transition disabled:opacity-50 mb-4"
            >
              💾 Guardar Precios Venues
            </button>
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">Agregar nuevo venue</p>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-orange-500"
                  placeholder="Nombre del venue"
                  value={newVenue.name}
                  onChange={e => setNewVenue(p => ({ ...p, name: e.target.value }))}
                />
                <input
                  type="number"
                  className="w-24 px-3 py-2 bg-black/30 border border-white/10 rounded-xl text-sm text-right font-mono text-orange-400 outline-none focus:border-orange-500"
                  value={newVenue.price}
                  onChange={e => setNewVenue(p => ({ ...p, price: +e.target.value }))}
                />
                <button
                  onClick={() => {
                    if (!newVenue.name.trim()) return;
                    const updated = { ...config.venue_prices, [newVenue.name.trim()]: newVenue.price };
                    saveConfig('venues', { venue_prices: updated });
                    setNewVenue({ name: '', price: 100 });
                  }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-sm transition"
                >
                  <Icon icon="ph:plus-bold" />
                </button>
              </div>
            </div>
          </Section>
        </div>

        {/* ── Pricing Matrix ── */}
        <Section icon="🚌" title="Matriz de Tarifas — Transporte y Guías (DKK/hora)">
          <p className="text-sm text-gray-400 mb-1">Precios base por hora facturada. Los guías se cobran +0.5h extra automáticamente.</p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="text-left py-3 px-2 font-semibold">Servicio</th>
                  {HOURS.map(h => (
                    <th key={h} className="px-2 py-3 text-center font-semibold w-20">{h}h</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BUS_TYPES.map(({ key, label }) => (
                  <tr key={key} className="border-b border-white/5 hover:bg-white/2 transition">
                    <td className="py-3 px-2 font-semibold text-orange-400 whitespace-nowrap">{label}</td>
                    {HOURS.map(h => {
                      const val = config[key]?.[h] ?? config[key]?.[String(h)] ?? '';
                      return (
                        <td key={h} className="px-1 py-2">
                          <input
                            type="number"
                            className="w-full px-2 py-1.5 bg-black/30 border border-white/10 rounded-lg text-center font-mono text-sm text-white outline-none focus:border-orange-500 transition"
                            value={val}
                            onChange={e => {
                              const updated = { ...config[key], [h]: +e.target.value };
                              setConfig(p => ({ ...p, [key]: updated }));
                            }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => {
              const patch = {};
              BUS_TYPES.forEach(({ key }) => { patch[key] = config[key]; });
              saveConfig('matrix', patch);
            }}
            disabled={savingSection === 'matrix'}
            className="mt-4 px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-sm transition disabled:opacity-50"
          >
            {savingSection === 'matrix' ? 'Guardando...' : '💾 Guardar Matriz de Precios'}
          </button>
        </Section>

        {/* ── Tours Manager ── */}
        <Section icon="🗺️" title="Gestión de Tours">
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-left">
                  {['Tour', 'Transporte', 'Duración', 'Puntos', 'Venues', ''].map(h => (
                    <th key={h} className="px-3 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(allTours).filter(([, v]) => !v.deleted).map(([name, info]) => {
                  const isCustom = !!config.custom_tours?.[name];
                  return (
                    <tr key={name} className="border-b border-white/5 hover:bg-white/3 transition">
                      <td className="px-3 py-3 font-semibold text-white">
                        {name}
                        {!isCustom && <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-full">base</span>}
                      </td>
                      <td className="px-3 py-3 text-gray-400 max-w-[160px] truncate">{info.transport}</td>
                      <td className="px-3 py-3 font-mono text-orange-400">{info.hours}h</td>
                      <td className="px-3 py-3 text-gray-400 max-w-[200px] truncate">{info.sights}</td>
                      <td className="px-3 py-3 text-emerald-400 text-xs">{info.venues?.join(', ') || '—'}</td>
                      <td className="px-3 py-3 text-right">
                        {isCustom && (
                          <button
                            onClick={() => {
                              if (!window.confirm(`¿Eliminar tour "${name}"?`)) return;
                              const updated = { ...config.custom_tours };
                              delete updated[name];
                              saveConfig('tours', { custom_tours: updated });
                            }}
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            <Icon icon="ph:trash-bold" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Tour */}
          <div className="bg-black/20 rounded-xl p-5 border border-white/5 border-l-2 border-l-orange-500">
            <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2"><Icon icon="ph:plus-circle-bold" /> Crear Tour Nuevo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <Input label="Nombre" value={newTour.name} onChange={e => setNewTour(p => ({ ...p, name: e.target.value }))} placeholder="Ej: VIP Evening Tour" />
              <Input label="Horas Tour" type="number" step="0.5" value={newTour.hours} onChange={e => setNewTour(p => ({ ...p, hours: +e.target.value }))} />
              <Input label="Horas Bus (opcional)" type="number" step="0.5" value={newTour.busHours} onChange={e => setNewTour(p => ({ ...p, busHours: e.target.value }))} placeholder="Igual al tour" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <Input label="Transporte" value={newTour.transport} onChange={e => setNewTour(p => ({ ...p, transport: e.target.value }))} placeholder="Ej: Bus + Caminata" />
              <Input label="Puntos a visitar" value={newTour.sights} onChange={e => setNewTour(p => ({ ...p, sights: e.target.value }))} placeholder="Ej: La Sirenita, Nyhavn..." />
            </div>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Venues incluidos</p>
              <div className="flex flex-wrap gap-2">
                {venueList.map(([name]) => (
                  <label key={name} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition ${newTour.venues.includes(name) ? 'bg-orange-600/20 border-orange-500 text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:text-white'}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={newTour.venues.includes(name)}
                      onChange={e => {
                        setNewTour(p => ({
                          ...p,
                          venues: e.target.checked ? [...p.venues, name] : p.venues.filter(v => v !== name)
                        }));
                      }}
                    />
                    {name}
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                if (!newTour.name.trim()) return alert('El tour necesita un nombre.');
                const updated = {
                  ...(config.custom_tours || {}),
                  [newTour.name.trim()]: {
                    hours: newTour.hours,
                    busHours: newTour.busHours ? +newTour.busHours : undefined,
                    transport: newTour.transport,
                    sights: newTour.sights,
                    venues: newTour.venues,
                  }
                };
                saveConfig('tours', { custom_tours: updated });
                setNewTour({ name: '', hours: 4, busHours: '', transport: '', sights: '', venues: [] });
              }}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-sm transition"
            >
              <Icon icon="ph:plus-bold" className="inline mr-1" /> Guardar Tour
            </button>
          </div>
        </Section>

        {/* ── Promo Offer ── */}
        <Section icon="🏷️" title="Oferta Promocional">
          <p className="text-sm text-gray-400 mb-4">El popup aparece la primera vez que el agente entra a la calculadora en la sesión.</p>
          {(() => {
            const offer = config.active_offer || { label: '', discount_percent: 10, valid_until: '', enabled: false };
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Etiqueta de la Oferta"
                  value={offer.label}
                  onChange={e => setConfig(p => ({ ...p, active_offer: { ...offer, label: e.target.value } }))}
                  placeholder="Ej: 10% OFF First Booking"
                />
                <Input
                  label="% Descuento"
                  type="number" min="0" max="100"
                  value={offer.discount_percent}
                  onChange={e => setConfig(p => ({ ...p, active_offer: { ...offer, discount_percent: +e.target.value } }))}
                />
                <Input
                  label="Válida Hasta"
                  type="date"
                  value={offer.valid_until?.split('T')[0] || ''}
                  onChange={e => setConfig(p => ({ ...p, active_offer: { ...offer, valid_until: e.target.value } }))}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Estado</label>
                  <label className="flex items-center gap-3 px-4 py-3 bg-black/30 border border-white/10 rounded-xl cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={offer.enabled || false}
                        onChange={e => setConfig(p => ({ ...p, active_offer: { ...offer, enabled: e.target.checked } }))}
                      />
                      <div className="w-10 h-5 bg-gray-700 rounded-full peer-checked:bg-emerald-500 transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                    </div>
                    <span className={`text-sm font-semibold ${offer.enabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {offer.enabled ? '✅ Activa' : '⭕ Desactivada'}
                    </span>
                  </label>
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={() => saveConfig('offer', { active_offer: config.active_offer })}
                    disabled={savingSection === 'offer'}
                    className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm transition disabled:opacity-50"
                  >
                    {savingSection === 'offer' ? 'Guardando...' : '💾 Guardar Oferta'}
                  </button>
                </div>
              </div>
            );
          })()}
        </Section>

        {/* ── Invoice History ── */}
        <Section icon="📋" title="Historial de Invoices">
          <div className="flex justify-end mb-4">
            <button onClick={loadInvoices} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition">
              <Icon icon="ph:arrows-clockwise-bold" /> Actualizar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-left">
                  {['Invoice #', 'Fecha', 'Agente', 'Cliente', 'Tour', 'Depósito', 'Restante', 'Estado', 'Acciones'].map(h => (
                    <th key={h} className="px-3 py-3 font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoicesLoading && (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-500">
                    <Icon icon="ph:spinner-bold" className="animate-spin inline mr-2" /> Cargando...
                  </td></tr>
                )}
                {!invoicesLoading && invoices.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-500">No hay invoices todavía</td></tr>
                )}
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-white/5 hover:bg-white/3 transition">
                    <td className="px-3 py-3 font-mono text-orange-400 font-bold">{inv.invoice_no || `#${inv.id}`}</td>
                    <td className="px-3 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(inv.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-3 py-3 text-gray-300 whitespace-nowrap">{inv.agent_name}</td>
                    <td className="px-3 py-3 text-white whitespace-nowrap">{inv.client_name}</td>
                    <td className="px-3 py-3 text-gray-400 max-w-[140px] truncate">{inv.tour_name}</td>
                    <td className="px-3 py-3 font-mono text-right text-yellow-400 whitespace-nowrap">
                      DKK {fmt(inv.deposit_amount)}
                    </td>
                    <td className="px-3 py-3 font-mono text-right text-emerald-400 whitespace-nowrap">
                      DKK {fmt(inv.remaining_amount)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge status={inv.status} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1.5 justify-center">
                        {inv.status === 'deposit_sent' && (
                          <button
                            onClick={() => generateFinalInvoice(inv)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/20 border border-orange-500/50 text-orange-400 text-xs font-bold hover:bg-orange-500/30 transition whitespace-nowrap"
                          >
                            <Icon icon="ph:receipt-bold" className="text-sm" /> Final
                          </button>
                        )}
                        {inv.status !== 'credit_note' && (
                          <button
                            onClick={() => generateCreditNote(inv)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold hover:bg-red-500/30 transition whitespace-nowrap"
                          >
                            <Icon icon="ph:x-circle-bold" className="text-sm" /> Crédito
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── Reviews Moderation ── */}
        <Section icon="💬" title="Moderación de Reseñas">
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <p className="text-sm text-gray-400">Solo se pueden eliminar las reseñas enviadas desde el sitio. Las del Google Sheet son de solo lectura.</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Filtrar por nombre o tour..."
                value={reviewFilter}
                onChange={e => setReviewFilter(e.target.value)}
                className="px-3 py-1.5 bg-black/30 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-orange-500 w-56"
              />
              <button onClick={loadAdminReviews} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition">
                <Icon icon="ph:arrows-clockwise-bold" /> Actualizar
              </button>
            </div>
          </div>

          {reviewsLoading ? (
            <div className="text-center py-8 text-gray-500">
              <Icon icon="ph:spinner-bold" className="animate-spin inline mr-2" /> Cargando reseñas...
            </div>
          ) : adminReviews.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No hay reseñas en la base de datos todavía.</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {adminReviews
                .filter(r => !reviewFilter || r.name?.toLowerCase().includes(reviewFilter.toLowerCase()) || r.tour?.toLowerCase().includes(reviewFilter.toLowerCase()))
                .map(r => (
                  <div key={r.id} className="flex items-start gap-4 bg-black/20 rounded-xl p-4 border border-white/5 hover:border-white/10 transition">
                    {/* Stars */}
                    <div className="text-yellow-400 text-lg whitespace-nowrap mt-0.5">
                      {'★'.repeat(r.rating)}<span className="text-gray-700">{'★'.repeat(5 - r.rating)}</span>
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-white text-sm">{r.name}</span>
                        <span className="text-gray-500 text-xs">{r.country}</span>
                        <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded-full">{r.tour}</span>
                        <span className="text-gray-600 text-xs ml-auto">{r.date}</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{r.review_text}</p>
                    </div>
                    {/* Delete */}
                    <button
                      onClick={() => deleteReview(r.id, r.name)}
                      className="flex-shrink-0 p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Eliminar reseña"
                    >
                      <Icon icon="ph:trash-bold" className="text-lg" />
                    </button>
                  </div>
                ))
              }
            </div>
          )}
        </Section>

      </div>
    </div>
  );
}
