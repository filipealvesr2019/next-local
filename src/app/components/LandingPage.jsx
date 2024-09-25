"use cliente"
import React from "react";
// import NavBar from "../components/NavBar";
import styles from "./LandingPage.module.css";
// import SubscriptionPlans from "../components/SubscriptionPlans";
import Link from "next/link";

const LandingPage = () => {
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* <NavBar /> */}
        <div className={styles.navContainer}>
          <nav className={styles.nav}>
            <ul className={styles.ul}>
     
              <Link  href="/">
                <img
                  src="https://i.imgur.com/eIsbYKG.jpg"
                  title="source: imgur.com"
                  className={styles.img}
                />
              </Link>
              
        
              <li className={styles.li}>
                <Link href="#planos">Planos</Link>
              </li>
              <li className={styles.li}>
                <Link href="#servicos">Sobre</Link>
              </li>
              <li className={styles.li}>
                <Link href="#contato">Contato</Link>
              </li>
            </ul>
            <ul className={styles.ul}>
              <Link  href="/login">
              <li className={styles.li}>
                <button href="#Login" className={styles.button}>
                  Login
                </button>
              </li>
              </Link>
              <Link  href="/register">
              <li className={styles.li}>
                <button href="#Cadastro" className={styles.button}>
                  Cadastro
                </button>
              </li>

            </Link>
           
            </ul>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <section id="sobre">
          <h2 className={styles.h2}>
          Transforme Seu Delivery com Nossa Solução Completa


          </h2>
          <p className={styles.p}>
          Descubra o futuro da gestão de delivery com o nosso sistema de assinatura inovador. Combinando um ERP robusto e um site local personalizado, oferecemos uma solução tudo-em-um que vai além das expectativas.
          </p>
        </section>
        <section id="servicos">
          <h2 className={styles.h2}>Com nosso sistema, você poderá:</h2>
          <p className={styles.p}>
            <b>Gerenciar Pedidos e Estoque: </b> Controle suas operações com facilidade, otimizando o gerenciamento de pedidos e o estoque em tempo real.

          </p>

          <p className={styles.p}>
            <b>Personalizar Seu Site de Delivery: </b> Tenha um site local adaptado às suas necessidades, garantindo uma experiência de usuário intuitiva e eficiente.
          </p>

          <p className={styles.p}>
            <b>Automatizar Processos: </b> Automatize tarefas repetitivas e ganhe mais tempo para focar no crescimento do seu negócio.
          </p>
          <p className={styles.p}>
            <b>Analisar Desempenho: </b> Acompanhe métricas detalhadas e tome decisões informadas para aprimorar seu serviço.
          </p>
          <button className={styles.button}>Comece Hoje</button>
        </section>
        <section id="contato">
          <h2 className={styles.h2}>Contato</h2>
          <p>Formulário ou informações de contato.</p>
        </section>
        <section id="sobre">
          <h2 className={styles.h2}>Quem Somos</h2>
          <p>
          Somos uma equipe dedicada a revolucionar o setor de delivery com soluções tecnológicas avançadas. Nossa missão é proporcionar ferramentas que ajudam empresas a crescerem e a oferecerem um serviço excepcional aos seus clientes.
          </p>
          <h2 className={styles.h2}>Nossos Valores:</h2>

          <p className={styles.p}>
            <b>Inovação: </b> Estamos sempre em busca de novas soluções para
            aprimorar sua experiência.
          </p>

          <p className={styles.p}>
            <b>Facilidade de Uso: </b> Nossos produtos são projetados para serem
            intuitivos e acessíveis a todos.
          </p>
          <p className={styles.p}>
            <b>Suporte ao Cliente: </b> Oferecemos suporte dedicado para
            ajudá-lo em cada etapa do caminho.
          </p>
        </section>
        <section id="planos">

{/* <SubscriptionPlans /> */}
        </section>
        <section id="contato" className={styles.contato}>
          <h2 className={styles.h2}>Contato</h2>

          <div>
            <h2 className={styles.h3}>Fale Conosco</h2>
            <p className={styles.p}>
              <b>Email: </b> contato@[nomedaempresa].com
            </p>
            <p className={styles.p}>
              <b>Telefone: </b> (11) 1234-5678
            </p>
            <p className={styles.p}>
              <b>Endereço: </b> Rua Exemplo, 123, São Paulo, SP
            </p>
          </div>

          <div>
            <h2 className={styles.h3}>Links Úteis</h2>
            <p className={styles.p}>Quem Somos</p>
            <p className={styles.p}>Planos</p>
            <p className={styles.p}>Contato</p>
          </div>

          <div>
            <h2 className={styles.h3}>Redes Sociais</h2>
            <p className={styles.p}>Facebook</p>
            <p className={styles.p}>Instagram</p>
            <p className={styles.p}>LinkedIn</p>
          </div>
        </section>
      </main>
      <footer>
        <p>Copyright © 2024 [Nome da Empresa]. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
