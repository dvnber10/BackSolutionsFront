// RUTA: src/pages/About.tsx
const About = () => (
  <div className="page-shell">
    
    {/* 1. HERO: Propuesta de Valor Clara */}
    <section className="page-section hero-about">
      <span className="eyebrow">Quiénes Somos</span>
      <h1>Transformamos datos y código en ventajas competitivas</h1>
      <p className="lead-text">
        Somos un equipo de ingeniería y diseño especializado en construir ecosistemas digitales robustos. 
        No nos limitamos a escribir código; analizamos el modelo de negocio de nuestros clientes para 
        desarrollar software a medida que optimiza procesos, automatiza tareas y multiplica las ventas.
      </p>
    </section>

    <hr className="section-divider" />

    {/* 2. CAPACIDADES: ¿Qué podemos hacer por el cliente? */}
    <section className="page-section">
      <span className="eyebrow">Especialidades</span>
      <h2>Nuestras Líneas de Solución</h2>
      <p className="section-subtitle">Cubrimos todo el ciclo tecnológico que un negocio moderno necesita para escalar.</p>
      
      <div className="card-grid capabilities-grid">
        <article className="info-card intensive">
          <div className="card-icon">💻</div>
          <h3>Desarrollo de Software a Medida</h3>
          <p>
            Construimos aplicaciones web y APIs empresariales bajo principios de <strong>Arquitectura Limpia</strong>. 
            Garantizamos sistemas rápidos, altamente seguros y listos para soportar miles de usuarios concurrentes sin degradar el rendimiento.
          </p>
        </article>

        <article className="info-card intensive">
          <div className="card-icon">📊</div>
          <h3>Analítica de Datos y Business Intelligence</h3>
          <p>
            Convertimos bases de datos crudas en tableros de control visuales e interactivos. Diseñamos herramientas 
            que te permiten auditar tus métricas de ventas, detectar cuellos de botella y tomar decisiones basadas en realidades, no en intuición.
          </p>
        </article>

        <article className="info-card intensive">
          <div className="card-icon">🤖</div>
          <h3>Automatización e IA Local</h3>
          <p>
            Optimizamos tus operaciones integrando agentes inteligentes de atención, chatbots de comercio conversacional 
            y flujos automatizados. Priorizamos el uso de <strong>modelos de lenguaje locales</strong> para proteger la privacidad de tus datos y reducir costos de servidores.
          </p>
        </article>

        <article className="info-card intensive">
          <div className="card-icon">🔌</div>
          <h3>Integraciones y Ecosistemas</h3>
          <p>
            Conectamos tus sistemas existentes con pasarelas de pago, webhooks de mensajería (Meta, WhatsApp) y CRMs. 
            Hacemos que tus herramientas de software hablen entre sí de forma fluida y automatizada.
          </p>
        </article>
      </div>
    </section>

    <hr className="section-divider" />

    {/* 3. METODOLOGÍA: El proceso transparente que genera confianza */}
    <section className="page-section workflow-section">
      <span className="eyebrow">El Proceso</span>
      <h2>Cómo garantizamos el éxito de tu proyecto</h2>
      <p className="section-subtitle">Un enfoque transparente, ágil y sin sorpresas de última hora.</p>

      <div className="workflow-steps">
        <div className="step-item">
          <div className="step-number">01</div>
          <h4>Inmersión y Estrategia</h4>
          <p>Entendemos tus objetivos comerciales, mapeamos tus bases de datos actuales y definimos el alcance real del proyecto.</p>
        </div>

        <div className="step-item">
          <div className="step-number">02</div>
          <h4>Arquitectura y Diseño</h4>
          <p>Estructuramos la base técnica del proyecto antes de programar, asegurando una base de datos óptima y una interfaz intuitiva.</p>
        </div>

        <div className="step-item">
          <div className="step-number">03</div>
          <h4>Desarrollo Ágil e Integración</h4>
          <p>Escribimos código limpio con entregas constantes para que puedas ver y probar los avances del sistema en tiempo real.</p>
        </div>

        <div className="step-item">
          <div className="step-number">04</div>
          <h4>Despliegue y Soporte</h4>
          <p>Lanzamos la solución a producción bajo entornos optimizados y te acompañamos en el proceso de adopción tecnológica.</p>
        </div>
      </div>
    </section>

    <hr className="section-divider" />

    {/* 4. VALORES/DIFERENCIALES: Por qué elegirnos a nosotros */}
    <section className="page-section">
      <span className="eyebrow">Diferenciales</span>
      <h2>¿Por qué trabajar con nosotros?</h2>
      
      <div className="card-grid">
        <article className="info-card">
          <div className="card-icon">🛡️</div>
          <h3>Código con Garantía de Futuro</h3>
          <p>Diseñamos software desacoplado y modular. Si tu negocio cambia o crece mañana, el sistema crecerá contigo sin tener que reescribirlo desde cero.</p>
        </article>
        
        <article className="info-card">
          <div className="card-icon">💡</div>
          <h3>Eficiencia en Infraestructura</h3>
          <p>Sabemos optimizar recursos. Desarrollamos soluciones eficientes que consumen la menor cantidad de recursos de servidor, reduciendo tus costos fijos operativos.</p>
        </article>
        
        <article className="info-card">
          <div className="card-icon">🤝</div>
          <h3>Comunicación Directa</h3>
          <p>Hablas directamente con los ingenieros a cargo de tu producto. Sin intermediarios, sin tecnicismos innecesarios, directo a las soluciones.</p>
        </article>
      </div>
    </section>

    <hr className="section-divider" />

    {/* 5. CALL TO ACTION CONTUNDENTE */}
    <section className="page-section cta-section-advanced">
      <div className="cta-content">
        <h2>¿Listo para llevar tu infraestructura al siguiente nivel?</h2>
        <p>
          Ya sea que necesites auditar tus datos de ventas con un tablero inteligente, automatizar tus canales de atención o 
          construir una plataforma desde cero, tenemos la experiencia técnica para hacerlo realidad.
        </p>
        <div className="cta-actions">
          <button className="btn-primary-lg">Agendar una Consultoría Técnica</button>
          <span className="cta-note">* Analizaremos tu caso sin costo ni compromisos iniciales.</span>
        </div>
      </div>
    </section>
  </div>
);

export default About;