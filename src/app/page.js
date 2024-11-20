"use client"
import Carousel from "./components/Carousel";
import ModalFormsOnibus from "./components/ModalFormsOnibus";
import styles from "./page.module.css";

export default function Home() {





  return (
    <div className={styles.page}>
      <header className={styles.header}>
      <div className={styles.containerlogoEnome}>
        <img className={styles.logoOnibus} src="/logo/onibus.svg" alt="Logo de um onibus  com borda preta"/>
        <h1 className={styles.h1}>Pega o bus AI</h1>
      </div>
        <div className={styles.containerbtnHeader}>
          <button className={styles.headerBtnlogin} >Login</button>
          <button className={styles.headerBtnInicie} >Inicie</button>
        </div>
      </header>
      <main className={styles.main}>
        <ModalFormsOnibus/>
        <Carousel/>
      </main>
    </div>
  );
}
