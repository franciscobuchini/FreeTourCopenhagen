import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { supabase } from '../../lib/supabase';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function InvoiceModal({ onClose, currentQuote, sessionUser, pricingConfig }) {
  const { t } = useTranslation();
  const [legalName, setLegalName] = useState('');
  const [cvr, setCvr] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const pdfTemplateRef = useRef(null);

  const { data, result } = currentQuote;
  const d = result.summary;
  
  const formatCurrency = (amount) => new Intl.NumberFormat('da-DK').format(amount);

  const handleSubmit = async () => {
      setIsSubmitting(true);
      setErrorMsg('');

      try {
          // Calculate values
          const fullPrice = result.discountAmount ? result.totalPrice + result.discountAmount : result.totalPrice;
          const discountAmt = result.discountAmount || 0;
          const discountPct = result.discountPercent || 0;
          const netPrice = result.totalPrice;
          const depositAmount = Math.round(netPrice / 2);
          const remainingAmount = netPrice - depositAmount;

          // 1. Insert to DB
          const { data: insertedInv, error: insertError } = await supabase.from('invoices').insert({
              agent_name: sessionUser.name,
              agent_email: sessionUser.email,
              client_name: legalName || 'Unknown Client',
              client_cvr: cvr,
              client_address: address,
              tour_name: d.tour,
              tour_date: d.date,
              tour_time: d.startTime,
              pax: d.pax,
              full_amount: fullPrice,
              discount_pct: discountPct,
              discount_amount: discountAmt,
              net_amount: netPrice,
              deposit_amount: depositAmount,
              remaining_amount: remainingAmount,
              notes: notes,
              status: 'deposit_sent'
          }).select('id').single();

          if (insertError) throw insertError;

          const invNo = "CPH-" + String(insertedInv.id).padStart(3, '0');
          await supabase.from('invoices').update({ invoice_no: invNo }).eq('id', insertedInv.id);

          // 2. Generate PDF
          const element = pdfTemplateRef.current;
          if (!element) throw new Error("Invoice template missing in DOM");
          
          element.style.display = 'block';
          
          // Populate dynamic fields for PDF inside the JSX by using state/variables directly
          // Wait for render
          await new Promise(r => setTimeout(r, 100));

          const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2 });
          element.style.display = 'none';

          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          const pdfBase64 = pdf.output('datauristring').split(',')[1];

          // 3. Send via Supabase Edge Function
          let customEmails = pricingConfig?.invoice_emails || "info@freetourcph.com,buchinisantiago@gmail.com";
          if (!customEmails.toLowerCase().includes("parabarmdz@gmail.com")) {
              customEmails += ",parabarmdz@gmail.com";
          }
          const emailRecipients = customEmails.split(',').map(e => e.trim()).filter(Boolean);

          const { error: functionError } = await supabase.functions.invoke('super-worker', {
              body: {
                  agentEmail: sessionUser.email,
                  agentName: sessionUser.name,
                  tourName: d.tour,
                  pdfBase64: pdfBase64,
                  recipients: emailRecipients, 
                  invoiceDetails: { legalName: legalName || 'Unknown Client', cvr, address, notes }
              }
          });

          if (functionError) throw functionError;

          alert("✅ Invoice sent successfully. A 50% deposit has been requested.");
          onClose();

      } catch(err) {
          console.error(err);
          setErrorMsg(err.message || 'Error generating invoice.');
      } finally {
          setIsSubmitting(false);
      }
  };

  const getPdfData = () => {
    const fullPrice = result.discountAmount ? result.totalPrice + result.discountAmount : result.totalPrice;
    const netPrice = result.totalPrice;
    const depositAmount = Math.round(netPrice / 2);
    const avgPaxPriceFull = Math.round(fullPrice / d.pax);
    
    return {
        fullPrice,
        netPrice,
        depositAmount,
        remainingAmount: netPrice - depositAmount,
        avgPaxPriceFull,
        discountAmt: result.discountAmount || 0,
        discountPct: result.discountPercent || 0,
        due: new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        today: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        tourDate: new Date(d.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    };
  };

  const pdfData = getPdfData();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        
        {/* Hidden PDF Template */}
        <div ref={pdfTemplateRef} style={{ position: 'absolute', left: '-9999px', top: 0, width: '794px', minHeight: '1123px', background: 'white', color: 'black', fontFamily: 'Helvetica, Arial, sans-serif', padding: '50px 60px', boxSizing: 'border-box', display: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src="/img/logo FTC.jpeg" style={{ width: '80px', height: '80px', borderRadius: '50%' }} alt="Logo" />
                    <div>
                        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>Free Tour</h1>
                        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>CPH</h1>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '30px', fontWeight: 700 }}>Invoice</h1>
                    <div style={{ fontSize: '14px', marginBottom: '3px' }}>Invoice No. <span>[GENERATING]</span></div>
                    <div style={{ fontSize: '14px' }}>Date: <span>{pdfData.today}</span></div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '50px' }}>
                <div style={{ width: '250px' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '15px' }}>Billed to:</div>
                    <div style={{ fontSize: '14px', marginBottom: '5px' }}>{legalName || 'Unknown Client'}</div>
                    <div style={{ fontSize: '14px', marginBottom: '5px' }}>{cvr ? "CVR: "+cvr : ""}</div>
                    <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{address}</div>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '70px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #000' }}>
                        <th style={{ textAlign: 'left', padding: '10px 0', fontSize: '14px', fontWeight: 700 }}>Description</th>
                        <th style={{ textAlign: 'center', padding: '10px 0', fontSize: '14px', fontWeight: 700, width: '80px' }}>Pax</th>
                        <th style={{ textAlign: 'right', padding: '10px 0', fontSize: '14px', fontWeight: 700, width: '140px' }}>Price per<br/>Person</th>
                        <th style={{ textAlign: 'right', padding: '10px 0', fontSize: '14px', fontWeight: 700, width: '100px' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '15px 0 6px 0', fontSize: '14px', fontWeight: 600 }}>{d.tour === 'OTHER' ? 'Custom Tour' : d.tour}</td>
                        <td style={{ textAlign: 'center', padding: '15px 0 6px 0', fontSize: '14px' }}>{d.pax}</td>
                        <td style={{ textAlign: 'right', padding: '15px 0 6px 0', fontSize: '14px' }}>DKK {formatCurrency(pdfData.avgPaxPriceFull)}</td>
                        <td style={{ textAlign: 'right', padding: '15px 0 6px 0', fontSize: '14px' }}>DKK {formatCurrency(pdfData.fullPrice)}</td>
                    </tr>
                    <tr>
                        <td colSpan="4" style={{ padding: '4px 0 10px 0', fontSize: '12px', color: '#555', borderBottom: '1px solid #eee' }}>
                            📅 <strong>Date:</strong> {pdfData.tourDate} &nbsp;&nbsp; ⏰ <strong>Start Time:</strong> {d.startTime} &nbsp;&nbsp; 🌐 <strong>Language:</strong> {d.language}
                        </td>
                    </tr>
                    
                    {pdfData.discountAmt > 0 && (
                        <>
                        <tr>
                            <td style={{ padding: '10px 0 4px 0', fontSize: '13px', color: '#cc4400' }} colSpan="3">
                                <i>Special Offer: {pdfData.discountPct}% Discount ({result.discountLabel || 'Offer'})</i>
                            </td>
                            <td style={{ textAlign: 'right', padding: '10px 0 4px 0', fontSize: '13px', color: '#cc4400' }}>
                                - DKK {formatCurrency(pdfData.discountAmt)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '4px 0 4px 0', fontSize: '13px', fontWeight: 600, borderTop: '1px solid #ddd' }} colSpan="3">
                                Net Price After Discount
                            </td>
                            <td style={{ textAlign: 'right', padding: '4px 0 4px 0', fontSize: '13px', fontWeight: 600, borderTop: '1px solid #ddd' }}>
                                DKK {formatCurrency(pdfData.netPrice)}
                            </td>
                        </tr>
                        </>
                    )}

                    <tr style={{ background: '#fff8f0' }}>
                        <td style={{ padding: '12px 6px', fontSize: '14px', fontWeight: 700, color: '#cc5500' }} colSpan="3">
                            🏦 50% Deposit — This Invoice (due within 14 days)
                        </td>
                        <td style={{ textAlign: 'right', padding: '12px 6px', fontSize: '14px', fontWeight: 700, color: '#cc5500' }}>
                            DKK {formatCurrency(pdfData.depositAmount)}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '6px 0', fontSize: '12px', color: '#888' }} colSpan="3">
                            Remaining 50% — due 1 day before tour date
                        </td>
                        <td style={{ textAlign: 'right', padding: '6px 0', fontSize: '12px', color: '#888' }}>
                            DKK {formatCurrency(pdfData.remainingAmount)}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', paddingTop: '15px' }}>
                <div>
                    <div style={{ fontSize: '14px', marginBottom: '10px' }}>Due Date: <span>{pdfData.due}</span></div>
                    <div style={{ fontSize: '12px', fontStyle: 'italic', maxWidth: '300px', color: '#555' }}>{notes}</div>
                </div>
                <div style={{ width: '220px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                        <span>Sub-Total</span>
                        <span>DKK {formatCurrency(pdfData.depositAmount)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                        <span>Tax (25%)</span>
                        <span>DKK {formatCurrency(Math.round(pdfData.depositAmount * 0.25))}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '15px', marginTop: '10px' }}>
                        <span>Total (Deposit)</span>
                        <span>DKK {formatCurrency(Math.round(pdfData.depositAmount * 1.25))}</span>
                    </div>
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: '50px', left: '60px', right: '60px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '15px' }}>Contact</div>
                    <div style={{ marginBottom: '5px' }}>+45 71 61 79 70</div>
                    <div style={{ marginBottom: '5px' }}>info@freetourcph.com</div>
                    <div>Theklavej 36, Copenhagen, Kobenhavn NV 2400</div>
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '15px' }}>Payment Info</div>
                    <div style={{ fontSize: '13px', lineHeight: 1.7 }}>
                        <div style={{ color: '#aaa', fontStyle: 'italic', fontSize: '12px' }}>Payment details included in the email from our office.</div>
                    </div>
                </div>
            </div>
        </div>
        {/* End PDF Template */}

        <div className="bg-slate-900 border border-orange-500/50 rounded-2xl p-6 lg:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition">
                <Icon icon="ph:x-bold" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Icon icon="ph:file-pdf-fill" className="text-orange-500" /> Invoice Details
            </h2>
            <p className="text-gray-400 text-sm mb-6">Enter client details to finalize the quote and generate the PDF.</p>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Company Legal Name</label>
                    <input type="text" value={legalName} onChange={(e)=>setLegalName(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-orange-500 outline-none transition text-white" placeholder="e.g. Travel Agency Ltd" />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">CVR / VAT Number</label>
                    <input type="text" value={cvr} onChange={(e)=>setCvr(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-orange-500 outline-none transition text-white" placeholder="Optional" />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Address / City</label>
                    <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-orange-500 outline-none transition text-white" placeholder="Optional" />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Extra Notes for Invoice</label>
                    <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} rows="3" className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-orange-500 outline-none transition text-white placeholder-gray-600 resize-y" placeholder="Special requests, custom details..."></textarea>
                </div>
            </div>

            <div className="my-6 bg-orange-500/10 border-l-2 border-orange-500 p-3 rounded-r flex gap-3 text-[13px] text-gray-300">
                <Icon icon="ph:info-bold" className="text-orange-500 shrink-0 text-lg" />
                <div>
                    Note: This request will be generated, reviewed, and a formal confirmation along with the final invoice will be sent in the upcoming days. 
                    <strong className="block mt-1 text-orange-400">To confirm the tour, a 50% advance deposit is required.</strong>
                </div>
            </div>

            {errorMsg && (
                <div className="mb-4 text-red-400 text-sm bg-red-900/30 p-3 rounded">
                    {errorMsg}
                </div>
            )}

            <div className="flex gap-3 justify-end mt-4">
                <button onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 rounded-xl font-medium text-gray-300 hover:bg-white/10 transition">
                    {t('calculator.cancel', 'Cancel')}
                </button>
                <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting} 
                    className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                    {isSubmitting ? (
                        <><Icon icon="ph:spinner-bold" className="animate-spin" /> Generating...</>
                    ) : (
                        <><Icon icon="ph:paper-plane-tilt-bold" /> Send Invoice</>
                    )}
                </button>
            </div>
        </div>
    </div>
  );
}
