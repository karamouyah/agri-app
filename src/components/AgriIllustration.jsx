// File responsibility: Defines a reusable React UI component shared across pages.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// FieldRows handles this module workflow, using its parameters and returning JSX, data, or a service result.
function FieldRows({ opacity = 1 }) {
  return (
    <g opacity={opacity}>
      <path d="M50 326c82-24 167-24 256 0" stroke="#D8E9BE" strokeWidth="12" strokeLinecap="round" />
      <path d="M58 350c90-20 182-20 280 0" stroke="#C6DE98" strokeWidth="14" strokeLinecap="round" />
      <path d="M70 378c82-18 166-18 252 0" stroke="#AAC96F" strokeWidth="14" strokeLinecap="round" />
      <path d="M338 335c78-22 159-22 244 0" stroke="#DCEABF" strokeWidth="12" strokeLinecap="round" />
      <path d="M330 360c86-18 174-18 264 0" stroke="#BED98C" strokeWidth="14" strokeLinecap="round" />
      <path d="M320 388c78-15 158-15 240 0" stroke="#9EC363" strokeWidth="14" strokeLinecap="round" />
    </g>
  )
}

// WheatStem handles this module workflow, using its parameters and returning JSX, data, or a service result.
function WheatStem({ x, y, scale = 1, color = '#F5D78A' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 30V0" stroke="#F8FBEF" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M0 5c4 1 7 3 8 6-4 0-7-1.6-9-4" fill={color} />
      <path d="M0 10c4 1 7 3 8 6-4 0-7-1.6-9-4" fill={color} />
      <path d="M0 15c4 1 7 3 8 6-4 0-7-1.6-9-4" fill={color} />
      <path d="M0 7c-4 1-7 3-8 6 4 0 7-1.6 9-4" fill={color} />
      <path d="M0 12c-4 1-7 3-8 6 4 0 7-1.6 9-4" fill={color} />
      <path d="M0 17c-4 1-7 3-8 6 4 0 7-1.6 9-4" fill={color} />
    </g>
  )
}

// OrchardTrees handles this module workflow, using its parameters and returning JSX, data, or a service result.
function OrchardTrees() {
  return (
    <g>
      <rect x="438" y="252" width="8" height="30" rx="4" fill="#8E6139" />
      <circle cx="442" cy="238" r="16" fill="#4EA254" />
      <circle cx="430" cy="244" r="12" fill="#6CBB64" />
      <circle cx="454" cy="246" r="12" fill="#77C76B" />

      <rect x="474" y="244" width="8" height="34" rx="4" fill="#8E6139" />
      <circle cx="478" cy="228" r="18" fill="#4E9D52" />
      <circle cx="466" cy="236" r="12" fill="#79C76A" />
      <circle cx="490" cy="238" r="12" fill="#6AB965" />

      <circle cx="438" cy="242" r="2.5" fill="#EE775C" />
      <circle cx="447" cy="235" r="2.5" fill="#F0B650" />
      <circle cx="482" cy="231" r="2.5" fill="#EE775C" />
    </g>
  )
}

// BarnScene handles this module workflow, using its parameters and returning JSX, data, or a service result.
function BarnScene() {
  return (
    <g>
      <rect x="78" y="230" width="88" height="56" rx="10" fill="#C98A4A" />
      <path d="M68 238 122 196l54 42Z" fill="#A85B33" />
      <rect x="110" y="248" width="22" height="38" rx="8" fill="#85502F" />
      <rect x="88" y="248" width="14" height="14" rx="4" fill="#F7F4EB" />
      <rect x="140" y="248" width="14" height="14" rx="4" fill="#F7F4EB" />
      <path d="M190 272c18-16 34-20 50-16" stroke="#6AB965" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M184 248c16-18 30-24 44-24" stroke="#77C76B" strokeWidth="8" strokeLinecap="round" fill="none" />
    </g>
  )
}

// GlassCard handles this module workflow, using its parameters and returning JSX, data, or a service result.
function GlassCard({ x, y, width, height, children, accent = '#1F7A3D' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={width} height={height} rx="24" fill="rgba(255,255,255,0.74)" />
      <rect x="1.2" y="1.2" width={width - 2.4} height={height - 2.4} rx="22.8" stroke="rgba(255,255,255,0.55)" />
      <rect x="18" y="18" width="56" height="9" rx="4.5" fill={accent} opacity="0.9" />
      {children}
    </g>
  )
}

// HeroOverlay handles this module workflow, using its parameters and returning JSX, data, or a service result.
function HeroOverlay() {
  return (
    <>
      <GlassCard x={370} y={102} width={214} height={152} accent="#256D41">
        <rect x="18" y="48" width="178" height="14" rx="7" fill="#EAF5DE" />
        <rect x="18" y="72" width="118" height="12" rx="6" fill="#CBE4B0" />
        <rect x="18" y="102" width="48" height="28" rx="14" fill="#1F7A3D" />
        <rect x="76" y="102" width="48" height="28" rx="14" fill="#E9BE64" />
        <rect x="134" y="102" width="48" height="28" rx="14" fill="#8FC96B" />
      </GlassCard>

      <g transform="translate(116 188)">
        <ellipse cx="98" cy="146" rx="124" ry="28" fill="#9AB672" opacity="0.35" />
        <rect x="24" y="52" width="148" height="92" rx="22" fill="#C38A49" />
        <rect x="40" y="32" width="116" height="38" rx="18" fill="#D89C58" />
        <circle cx="56" cy="74" r="22" fill="#EE775C" />
        <circle cx="90" cy="60" r="26" fill="#F59E0B" />
        <circle cx="124" cy="76" r="22" fill="#7CC56A" />
        <circle cx="144" cy="58" r="18" fill="#EE775C" />
        <path d="M92 46c10-18 22-26 34-28-4 16-11 28-22 37" fill="#5E9F4E" />
        <path d="M58 46c-10-18-22-26-34-28 4 16 11 28 22 37" fill="#8BC967" />
        <WheatStem x={158} y={40} scale={0.8} />
      </g>

      <g transform="translate(404 282)">
        <rect x="0" y="26" width="142" height="54" rx="18" fill="#2E8A4B" />
        <rect x="82" y="0" width="44" height="40" rx="12" fill="#DDF1CB" />
        <rect x="92" y="9" width="24" height="17" rx="4" fill="#AED97B" />
        <circle cx="34" cy="84" r="16" fill="#4E5B53" />
        <circle cx="112" cy="84" r="16" fill="#4E5B53" />
        <path d="M8 60h136" stroke="#E9F6D3" strokeWidth="6" strokeLinecap="round" />
        <WheatStem x={20} y={8} scale={0.75} />
      </g>
    </>
  )
}

// AuthOverlay handles this module workflow, using its parameters and returning JSX, data, or a service result.
function AuthOverlay() {
  return (
    <>
      <GlassCard x={372} y={96} width={206} height={170} accent="#1A6C41">
        <rect x="18" y="48" width="170" height="12" rx="6" fill="#EAF4DE" />
        <rect x="18" y="72" width="170" height="12" rx="6" fill="#D3E8BF" />
        <rect x="18" y="104" width="82" height="34" rx="17" fill="#1F7A3D" />
        <rect x="110" y="104" width="78" height="34" rx="17" fill="#F1D082" />
      </GlassCard>

      <g transform="translate(112 194)">
        <circle cx="88" cy="70" r="64" fill="#E6F5D8" />
        <path d="M88 22c25 0 46 21 46 46 0 31-46 66-46 66S42 99 42 68c0-25 21-46 46-46Z" fill="#2D8B4D" />
        <path d="M88 40c9 0 18 6 18 17 0 12-18 28-18 28S70 69 70 57c0-11 9-17 18-17Z" fill="#F7FBEF" />
        <path d="M162 22 190 50 146 94 118 66Z" fill="#F1C66A" opacity="0.85" />
        <WheatStem x={26} y={98} scale={0.82} />
      </g>
    </>
  )
}

// BuyerOverlay handles this module workflow, using its parameters and returning JSX, data, or a service result.
function BuyerOverlay() {
  return (
    <>
      <GlassCard x={372} y={92} width={212} height={174} accent="#1F7A3D">
        <rect x="18" y="48" width="144" height="12" rx="6" fill="#EAF4DE" />
        <rect x="18" y="74" width="84" height="12" rx="6" fill="#CBE4B0" />
        <rect x="18" y="106" width="78" height="46" rx="16" fill="#F6FAEF" />
        <rect x="106" y="106" width="88" height="46" rx="16" fill="#F6FAEF" />
        <circle cx="164" cy="60" r="20" fill="#E7F3D8" />
        <path d="M157 60h14M164 53v14" stroke="#2D8B4D" strokeWidth="3" strokeLinecap="round" />
      </GlassCard>

      <g transform="translate(98 204)">
        <rect x="0" y="30" width="170" height="112" rx="28" fill="#F7FBEF" />
        <rect x="18" y="18" width="134" height="88" rx="22" fill="#DDF2CB" />
        <circle cx="58" cy="72" r="22" fill="#EE775C" />
        <circle cx="94" cy="58" r="26" fill="#7CC56A" />
        <circle cx="124" cy="78" r="18" fill="#F0B650" />
        <path d="M141 20c8 2 14 8 18 18" stroke="#2D8B4D" strokeWidth="5" strokeLinecap="round" />
        <circle cx="150" cy="24" r="22" fill="rgba(255,255,255,0.8)" />
        <circle cx="150" cy="24" r="14" stroke="#1F7A3D" strokeWidth="4" fill="none" />
        <path d="m160 34 18 18" stroke="#1F7A3D" strokeWidth="4" strokeLinecap="round" />
        <WheatStem x={22} y={16} scale={0.68} />
      </g>
    </>
  )
}

// FarmerOverlay handles this module workflow, using its parameters and returning JSX, data, or a service result.
function FarmerOverlay() {
  return (
    <>
      <GlassCard x={372} y={88} width={212} height={182} accent="#1E7A3C">
        <path d="M28 132h152" stroke="#D9EBC4" strokeWidth="10" strokeLinecap="round" />
        <rect x="28" y="58" width="24" height="74" rx="12" fill="#2D8B4D" />
        <rect x="72" y="76" width="24" height="56" rx="12" fill="#6BB968" />
        <rect x="116" y="42" width="24" height="90" rx="12" fill="#F0C766" />
        <rect x="160" y="92" width="24" height="40" rx="12" fill="#A8D06D" />
      </GlassCard>

      <g transform="translate(98 192)">
        <rect x="0" y="58" width="182" height="78" rx="26" fill="#D49856" />
        <rect x="18" y="36" width="148" height="52" rx="20" fill="#B17B45" />
        <path d="M38 44c12-18 30-28 54-32-8 22-18 35-34 44" fill="#77BE63" />
        <path d="M118 46c14-20 32-30 58-34-9 24-20 37-37 46" fill="#4A9F54" />
        <circle cx="44" cy="88" r="18" fill="#EE775C" />
        <circle cx="88" cy="76" r="20" fill="#F0B650" />
        <circle cx="126" cy="94" r="18" fill="#7CC56A" />
        <WheatStem x={154} y={30} scale={0.82} />
      </g>
    </>
  )
}

// TransporterOverlay handles this module workflow, using its parameters and returning JSX, data, or a service result.
function TransporterOverlay() {
  return (
    <>
      <GlassCard x={368} y={94} width={216} height={170} accent="#22734B">
        <path
          d="M28 118c28-18 52-24 74-18 18 5 34 5 48-3 10-6 24-10 34-8"
          stroke="#7DC067"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="28" cy="118" r="10" fill="#F0C766" />
        <circle cx="184" cy="89" r="10" fill="#1F7A3D" />
        <rect x="28" y="46" width="78" height="12" rx="6" fill="#EAF5DE" />
      </GlassCard>

      <g transform="translate(92 234)">
        <path d="M0 72h256" stroke="#C7D9AE" strokeWidth="18" strokeLinecap="round" />
        <rect x="24" y="18" width="144" height="58" rx="20" fill="#2C8A4B" />
        <rect x="120" y="0" width="54" height="42" rx="14" fill="#EAF5DE" />
        <rect x="130" y="10" width="32" height="16" rx="4" fill="#98CB74" />
        <circle cx="62" cy="84" r="18" fill="#4E5B53" />
        <circle cx="144" cy="84" r="18" fill="#4E5B53" />
        <path d="M200 46c14-26 28-42 46-48" stroke="#2D8B4D" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="252" cy="-6" r="20" fill="#F1D082" />
        <WheatStem x={210} y={14} scale={0.72} />
      </g>
    </>
  )
}

// AdminOverlay handles this module workflow, using its parameters and returning JSX, data, or a service result.
function AdminOverlay() {
  return (
    <>
      <GlassCard x={366} y={88} width={220} height={180} accent="#1F7A3D">
        <rect x="28" y="54" width="54" height="80" rx="18" fill="#DDF2CB" />
        <rect x="92" y="74" width="54" height="60" rx="18" fill="#F1D082" />
        <rect x="156" y="44" width="36" height="90" rx="18" fill="#7CC56A" />
        <path d="M28 148h164" stroke="#D5E8BE" strokeWidth="10" strokeLinecap="round" />
      </GlassCard>

      <g transform="translate(98 194)">
        <circle cx="96" cy="70" r="68" fill="#E8F4D8" />
        <path d="M96 16 134 34v38c0 34-26 56-38 64-12-8-38-30-38-64V34l38-18Z" fill="#2D8B4D" />
        <path d="m78 66 12 12 28-30" stroke="#F7FCEB" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="158" y="36" width="46" height="18" rx="9" fill="#F1D082" />
        <rect x="158" y="68" width="64" height="18" rx="9" fill="#D5E8BE" />
        <rect x="158" y="100" width="50" height="18" rx="9" fill="#C1DDA3" />
        <WheatStem x={26} y={96} scale={0.8} />
      </g>
    </>
  )
}

// EmptyOverlay handles this module workflow, using its parameters and returning JSX, data, or a service result.
function EmptyOverlay() {
  return (
    <>
      <GlassCard x={378} y={92} width={206} height={160} accent="#247546">
        <rect x="18" y="48" width="154" height="12" rx="6" fill="#EAF4DE" />
        <rect x="18" y="74" width="102" height="12" rx="6" fill="#D3E8BF" />
        <circle cx="154" cy="108" r="24" fill="#F7FBF1" />
        <circle cx="154" cy="108" r="15" stroke="#2D8B4D" strokeWidth="4" fill="none" />
        <path d="m165 119 18 18" stroke="#2D8B4D" strokeWidth="4" strokeLinecap="round" />
      </GlassCard>

      <g transform="translate(128 222)">
        <ellipse cx="82" cy="110" rx="104" ry="24" fill="#A6C67B" opacity="0.32" />
        <path d="M18 44c20-28 108-28 128 0v40c0 24-18 38-42 38H60c-24 0-42-14-42-38Z" fill="#C18B4D" />
        <path d="M32 46h100" stroke="#D9A366" strokeWidth="10" strokeLinecap="round" />
        <path d="M66 30c10-18 21-26 34-28-5 18-13 29-24 38" fill="#76BE63" />
        <path d="M96 26c12-16 25-22 40-24-6 16-15 26-29 34" fill="#5FA754" />
        <WheatStem x={140} y={30} scale={0.78} />
      </g>
    </>
  )
}

export default function AgriIllustration({ variant = 'hero', className = '' }) {
  return (
    <div className={`relative h-full w-full ${className}`}>
      <svg
        viewBox="0 0 640 480"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${variant} agricultural illustration`}
      >
        <defs>
          <linearGradient id="agriSky" x1="64" y1="48" x2="542" y2="428" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFDF4" />
            <stop offset="0.5" stopColor="#ECF6E2" />
            <stop offset="1" stopColor="#D8EDB8" />
          </linearGradient>
          <linearGradient id="agriHill" x1="180" y1="184" x2="480" y2="420" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A7D078" />
            <stop offset="1" stopColor="#4E8E49" />
          </linearGradient>
          <linearGradient id="agriHillBack" x1="150" y1="164" x2="510" y2="360" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DDEECC" />
            <stop offset="1" stopColor="#A9CF7E" />
          </linearGradient>
        </defs>

        <rect x="10" y="10" width="620" height="460" rx="36" fill="url(#agriSky)" />
        <circle cx="134" cy="112" r="44" fill="#F7D884" opacity="0.92" />
        <circle cx="516" cy="88" r="22" fill="white" opacity="0.55" />
        <circle cx="548" cy="112" r="18" fill="white" opacity="0.5" />
        <circle cx="486" cy="112" r="16" fill="white" opacity="0.48" />

        <path
          d="M0 270c92-98 182-124 278-90 48 16 104 17 164-8 58-24 121-20 198 16v282H0Z"
          fill="url(#agriHillBack)"
        />
        <path
          d="M0 318c95-72 190-88 286-54 73 26 134 27 190 0 56-27 112-25 164 4v202H0Z"
          fill="url(#agriHill)"
        />

        <BarnScene />
        <OrchardTrees />
        <FieldRows opacity={0.95} />

        <WheatStem x={86} y={354} scale={1.05} />
        <WheatStem x={118} y={364} scale={0.95} color="#EFC96C" />
        <WheatStem x={552} y={358} scale={1.02} />
        <WheatStem x={520} y={366} scale={0.9} color="#EFC96C" />

        <rect x="44" y="132" width="146" height="92" rx="24" fill="rgba(255,255,255,0.48)" />
        <rect x="58" y="150" width="62" height="12" rx="6" fill="#FFFFFF" opacity="0.88" />
        <rect x="58" y="172" width="94" height="12" rx="6" fill="#E6F3D7" />
        <rect x="58" y="196" width="72" height="12" rx="6" fill="#D0E6B6" />

        {variant === 'auth' && <AuthOverlay />}
        {variant === 'buyer' && <BuyerOverlay />}
        {variant === 'farmer' && <FarmerOverlay />}
        {variant === 'transporter' && <TransporterOverlay />}
        {variant === 'admin' && <AdminOverlay />}
        {variant === 'empty' && <EmptyOverlay />}
        {variant === 'hero' && <HeroOverlay />}
      </svg>
    </div>
  )
}
