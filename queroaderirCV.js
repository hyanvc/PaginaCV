$(document).ready(function () {
    $('#cpf-simulator').mask('999.999.999-99');
    $('#adesao-cpf').mask('999.999.999-99');
    $('#recommendation-cpf').mask('999.999.999-99');
    $('#cpf-form').mask('999.999.999-99');
    $('#phone-form').mask('(99) 99999-9999');
  });
  
  function slider2() {
    let splides = $('.splide-depoimento');
    for (let i = 0, splideLength = splides.length; i < splideLength; i++) {
      new Splide(splides[i], {
        perPage: 3,
        perMove: 1,
        start: 1,
        focus: 'center',
        type: 'loop',
        gap: '2rem',
        arrows: 'slider',
        pagination: 'slider',
        speed: 550,
        dragAngleThreshold: 80,
        autoWidth: false,
        rewind: false,
        rewindSpeed: 800,
        waitForTransition: false,
        updateOnMove: true,
        trimSpace: false,
        breakpoints: {
          991: {
            perPage: 2,
            gap: '4vw'
          },
          767: {
            perPage: 1,
            gap: '4vw'
          },
          479: {
            perPage: 1,
            gap: '5vw'
          }
        }
      }).mount();
    }
  }
  slider2();
  
  $(document).ready(function () {
    $('#email-banner').on('keyup', function () {
      $('#email-form').val($(this).val());
    });
  });
  
//   const btn = document.getElementById('clear-email');
  
//   btn.addEventListener('click', function handleClick(event) {
//     event.preventDefault();
  
//     const emailInput = document.getElementById('email-input');
//     emailInput.value = '';
//   });
  
  const API_AUTH_URL = 'https://{API_NAME}.capef.com.br/auth/access-token';
  const API_VALIDATE_CPF_URL = 'https://apiconsulta.capef.com.br/CPF/';
  const API_ELIGIBILITY_CV_PLAN_URL =
    'https://apiconsulta.capef.com.br/Elegibilidade/';
  const API_SIMULATE_CV_PLAN_CALCULATION_URL =
    'https://apiplanomercado.capef.com.br/Simulador/{FORMATTED_CPF}/Simular';
  
  const API_NAMES = {
    apiConsulta: 'apiconsulta',
    apiPlanoMercado: 'apiplanomercado'
  };
  
  let tag = document.createElement('script');
  // let btnCloseModal = getElement('#btn-close');
  let locationFile = window.location.pathname;
  
  tag.src = 'https://www.youtube.com/iframe_api';
  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  let player;
  
  const cpfAdesao = getElement('#adesao-cpf');
  const loading = getElement('#loading-icon');
  const successCPF = getElement('#success-cpf');
  const sendReview = getElement('#send-review');
  const simulationError = getElement('#simulation-error');
  const formQueroAderir = getElement('#form-quero-aderir');
  const simulationResults = getElement('#simulation-results');
  const formSimulation = getElement('#form-simulation');
  const loadingSimulation = getElement('#loading-icon-simulation');
  const cpfSimulation = getElement('#cpf-simulator');
  
    const loadingIcon = document.getElementById("loading-icon");
  
          const preloader = document.getElementById("preloader-adesao");
          loadingIcon.style.background = "#28343e";
          loadingIcon.style.padding = "10px";
          loadingIcon.style.borderRadius = "6px";
          loadingIcon.style.boxShadow = "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.2)";
  
          if (preloader) {
              preloader.style.display = "none";
              preloader.style.opacity = 1;
              preloader.style.position = "fixed";
              preloader.style.top = 0;
              preloader.style.left = 0;
              preloader.style.width = "100%";
              preloader.style.height = "100%";
          }
  
  function getElement(selector) {
    return document.querySelector(selector);
  }
  
  const getRequestOptions2 = accessToken => {
    return {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      redirect: 'follow'
    };
  };
  
  const formatCPF = cpf => cpf.replaceAll('.', '').replaceAll('-', '');
  
  const formatCurrency = currency =>
    new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    }).format(currency);
  
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '100%',
      width: '100%',
      videoId: `${
        locationFile == '/quero-aderir' ? '0FHT4dkv1GI' : '0FHT4dkv1GI?autoplay=0'
      }`,
      events: {
        onReady: onPlayerReady
      }
    });
  }
  
  function onPlayerReady() {
    // console.log("🚀 ~ event?.target", event?.target);
    // event.target.playVideo() && event.target.playVideo();
  }
  
  async function getToken(apiName) {
    const response = await fetch(API_AUTH_URL.replace('{API_NAME}', apiName), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: authUserName,
        password: authPassword
      })
    });
  
    if (!response.ok) {
      throw new Error(
        `Error getting token for API ${apiName}: ${response.status}`
      );
    }
  
    return response.json();
  }
  
  const makeAuthorizedRequest = async (url, apiName) => {
    const token = await getToken(API_NAMES[apiName]);
    const options = getRequestOptions2(token.access_Token);
  
    try {
      const response = await fetch(url, options);
  
  
        return await response.json();   
  
      
    } catch (error) {
      console.error(`Error making ${apiName} request:`, error);
      return null;
    }
  };
  
  const validateCPF = async cpf => {
    const formattedCPF = formatCPF(cpf);
    const url = `${API_VALIDATE_CPF_URL}${formattedCPF}`;
    return makeAuthorizedRequest(url, 'apiConsulta');
  };
  
  const simulateCVPlanComparativeCalculation = async cpf => {
    const formattedCPF = formatCPF(cpf);
    const url = API_SIMULATE_CV_PLAN_CALCULATION_URL.replace(
      '{FORMATTED_CPF}',
      formattedCPF
    );
    return makeAuthorizedRequest(url, 'apiPlanoMercado');
  };
  
  const cpfEligibilityCVPlan = async cpf => {
    const formattedCPF = formatCPF(cpf);
    const url = `${API_ELIGIBILITY_CV_PLAN_URL}${formattedCPF}/PlanoCV`;
    return makeAuthorizedRequest(url, 'apiConsulta');
  };
  
  // btnCloseModal.addEventListener('click', () => {
  //   getElement('#close-video').style.display = 'none';
  //   player.stopVideo();
  // });
  
  getElement('#close-btn-join-modal').addEventListener('click', () => {
    if (!cpfAdesao.value) {
      sendReview.style.display = 'none';
    }
  });
  
  getElement('#submit-cpf').addEventListener('click', async () => {
    getElement('#failure-cpf').style.display = 'none';
    const errorMsg = getElement("#error-msg-cpf")
    const submitWebflow = document.getElementById("webflow-submit")
  
    preloader.style.display = "flex"
    loadingIcon.style.display = "flex"
  
    successCPF.style.display = 'none';
    formQueroAderir.style.display = 'none';
    loading.style.display = 'block';
    
    if(cpfAdesao.value.length < 11){
      preloader.style.display = "none"
      loadingIcon.style.display = "none"
      formQueroAderir.style.display = 'block';
      loading.style.display = 'none';
        getElement('#failure-cpf').style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "CPF não é valido"
      return;
    }
  
    const isCPFValid = await validateCPF(cpfAdesao.value);
  
    if (!isCPFValid) {
        formQueroAderir.style.display = 'block';
          errorMsg.style.display = "block"
        var text = "Que bom que você demonstrou interesse no Plano CV I. Entretanto, seu CPF não consta em nosso banco de dados. Que tal conhecer mais sobre o Plano Família? ";
        var link = "https://capef-web.webflow.io/plano-familia";
        errorMsg.innerHTML = text + "<a href='" + link + "'>Plano Família.</a>";
        getElement('#failure-cpf').style.display = "block"
    } else {
  
      const response = await cpfEligibilityCVPlan(cpfAdesao.value)
          debugger;
      if(response.podeAderir){
        if(submitWebflow){
          submitWebflow.click()
        } 
        successCPF.style.display = 'block';
        sendReview.style.display = 'none';
        window.open("https://arearestrita.capef.com.br/SimuladorCV/NovoSimulador", "_self")
      }else{
        getElement('#failure-cpf').style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "Você já é participante do plano"
      }
  
     
    }
  
    preloader.style.display = "none"
    loadingIcon.style.display = "none"
    formQueroAderir.style.display = 'block';
    loading.style.display = 'none';
  
  });
  
  