import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminPage } from '../../components/admin/AdminPage';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import { useAdminSettings, useUpdateSettings } from '../../features/admin/queries';
import type { Hero, SeoDefaults, SocialLinks } from '../../features/content/types';
import { errorMessage } from '../../lib/http';
import './SettingsPage.scss';

const emptySocial: SocialLinks = {
  facebookUrl: null,
  instagramUrl: null,
  linkedInUrl: null,
  githubUrl: null,
  xUrl: null,
};

const emptyHero: Hero = {
  title: '',
  subtitle: '',
  imageUrl: null,
  primaryCta: { text: '', url: '' },
  secondaryCta: { text: '', url: '' },
};

const emptySeo: SeoDefaults = { title: '', description: null, ogImageUrl: null };

export default function SettingsPage() {
  const settings = useAdminSettings();
  const save = useUpdateSettings();

  const [companyName, setCompanyName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [address, setAddress] = useState('');
  const [footerText, setFooterText] = useState('');
  const [footerLegalText, setFooterLegalText] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState('');
  const [proposalValidityDays, setProposalValidityDays] = useState('15');
  const [social, setSocial] = useState<SocialLinks>(emptySocial);
  const [hero, setHero] = useState<Hero>(emptyHero);
  const [seo, setSeo] = useState<SeoDefaults>(emptySeo);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const data = settings.data;
    if (!data) {
      return;
    }
    setCompanyName(data.companyName);
    setLegalName(data.legalName);
    setTaxId(data.taxId ?? '');
    setLogoUrl(data.logoUrl ?? '');
    setFaviconUrl(data.faviconUrl ?? '');
    setContactEmail(data.contactEmail);
    setPhone(data.phone ?? '');
    setWhatsApp(data.whatsApp ?? '');
    setAddress(data.address ?? '');
    setFooterText(data.footerText);
    setFooterLegalText(data.footerLegalText ?? '');
    setDefaultCurrency(data.defaultCurrency);
    setProposalValidityDays(String(data.proposalValidityDays));
    setSocial(data.social ?? emptySocial);
    setHero(data.hero ?? emptyHero);
    setSeo(data.seo ?? emptySeo);
  }, [settings.data]);

  async function onSave() {
    setFeedback(null);
    if (!companyName.trim() || !contactEmail.trim() || !footerText.trim()) {
      setFeedback('Completá nombre, email de contacto y texto del footer.');
      return;
    }

    try {
      await save.mutateAsync({
        companyName: companyName.trim(),
        legalName: legalName.trim() || null,
        taxId: taxId.trim() || null,
        logoUrl: logoUrl.trim() || null,
        faviconUrl: faviconUrl.trim() || null,
        contactEmail: contactEmail.trim(),
        phone: phone.trim() || null,
        whatsApp: whatsApp.trim() || null,
        address: address.trim() || null,
        social,
        hero,
        footerText: footerText.trim(),
        footerLegalText: footerLegalText.trim() || null,
        seo,
        defaultCurrency: defaultCurrency.trim() || null,
        proposalValidityDays: Number(proposalValidityDays) || null,
      });
      setFeedback('Configuración guardada.');
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  }

  if (settings.isLoading) {
    return <StateBlock variant="loading" />;
  }

  if (settings.isError || !settings.data) {
    return (
      <StateBlock
        variant="error"
        title="No pudimos cargar la configuración"
        onRetry={() => void settings.refetch()}
      />
    );
  }

  return (
    <AdminPage
      title="Configuración"
      description="Datos de la empresa, hero, redes y SEO por defecto."
      actions={
        <Button loading={save.isPending} onClick={() => void onSave()}>
          Guardar
        </Button>
      }
    >
      <Helmet>
        <title>Configuración · Panel BackSolutions</title>
      </Helmet>

      {feedback && <p className="admin-note">{feedback}</p>}

      <div className="settings-grid">
        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Empresa</h2>
          </div>
          <div className="panel__body form-grid form-grid--2">
            <Input label="Nombre" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <Input label="Razón social" value={legalName} onChange={(e) => setLegalName(e.target.value)} />
            <Input label="CUIT / Tax ID" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
            <Input label="Email de contacto" required type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            <Input label="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label="WhatsApp" value={whatsApp} onChange={(e) => setWhatsApp(e.target.value)} />
            <Input label="Logo (URL)" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
            <Input label="Favicon (URL)" value={faviconUrl} onChange={(e) => setFaviconUrl(e.target.value)} />
            <Input label="Moneda por defecto" value={defaultCurrency} onChange={(e) => setDefaultCurrency(e.target.value)} />
            <Input
              label="Validez de propuestas (días)"
              inputMode="numeric"
              value={proposalValidityDays}
              onChange={(e) => setProposalValidityDays(e.target.value)}
            />
            <div className="settings-grid__full">
              <Textarea label="Dirección" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Footer</h2>
          </div>
          <div className="panel__body form-grid">
            <Textarea label="Texto del footer" required rows={2} value={footerText} onChange={(e) => setFooterText(e.target.value)} />
            <Textarea label="Texto legal" rows={2} value={footerLegalText} onChange={(e) => setFooterLegalText(e.target.value)} />
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Redes sociales</h2>
          </div>
          <div className="panel__body form-grid form-grid--2">
            <Input label="Facebook" value={social.facebookUrl ?? ''} onChange={(e) => setSocial({ ...social, facebookUrl: e.target.value || null })} />
            <Input label="Instagram" value={social.instagramUrl ?? ''} onChange={(e) => setSocial({ ...social, instagramUrl: e.target.value || null })} />
            <Input label="LinkedIn" value={social.linkedInUrl ?? ''} onChange={(e) => setSocial({ ...social, linkedInUrl: e.target.value || null })} />
            <Input label="GitHub" value={social.githubUrl ?? ''} onChange={(e) => setSocial({ ...social, githubUrl: e.target.value || null })} />
            <Input label="X" value={social.xUrl ?? ''} onChange={(e) => setSocial({ ...social, xUrl: e.target.value || null })} />
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Hero de inicio</h2>
          </div>
          <div className="panel__body form-grid form-grid--2">
            <Input label="Título" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
            <Input label="Subtítulo" value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} />
            <Input label="Imagen (URL)" value={hero.imageUrl ?? ''} onChange={(e) => setHero({ ...hero, imageUrl: e.target.value || null })} />
            <div />
            <Input
              label="CTA principal · texto"
              value={hero.primaryCta.text}
              onChange={(e) => setHero({ ...hero, primaryCta: { ...hero.primaryCta, text: e.target.value } })}
            />
            <Input
              label="CTA principal · URL"
              value={hero.primaryCta.url}
              onChange={(e) => setHero({ ...hero, primaryCta: { ...hero.primaryCta, url: e.target.value } })}
            />
            <Input
              label="CTA secundario · texto"
              value={hero.secondaryCta.text}
              onChange={(e) => setHero({ ...hero, secondaryCta: { ...hero.secondaryCta, text: e.target.value } })}
            />
            <Input
              label="CTA secundario · URL"
              value={hero.secondaryCta.url}
              onChange={(e) => setHero({ ...hero, secondaryCta: { ...hero.secondaryCta, url: e.target.value } })}
            />
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">SEO por defecto</h2>
          </div>
          <div className="panel__body form-grid">
            <Input label="Título" value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} />
            <Textarea label="Descripción" rows={3} value={seo.description ?? ''} onChange={(e) => setSeo({ ...seo, description: e.target.value || null })} />
            <Input label="Imagen OG (URL)" value={seo.ogImageUrl ?? ''} onChange={(e) => setSeo({ ...seo, ogImageUrl: e.target.value || null })} />
          </div>
        </section>
      </div>
    </AdminPage>
  );
}
