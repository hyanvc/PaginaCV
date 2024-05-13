var urlConsulta = "https://apiconsulta.capef.com.br";
var urlIndicacao = "https://apiindicacaoplano.capef.com.br";

async function setupToken({url}) {
     let token = localStorage.getItem(url);

         const authResponse = await fetch(`${url}/Auth/Access-Token`, {
             method: "POST",
             body: JSON.stringify({
                 userName: "Hero99",
                 password: "d7OwsEqTXc"
             }),
             headers: {
                 "Content-Type": "application/json"
             }
         });

         if (!authResponse.ok) {
             throw new Error("Failed to obtain authentication token");
         }

         const authData = await authResponse.json();
         token = authData.access_Token;

         localStorage.setItem(url, token);
     
 }

 async function authFetch(url, options = {}) {
     try {
         let token = localStorage.getItem(options.key);

         const headers = {
             ...options.headers,
             "Authorization": `Bearer ${token}`
         };

         const dataResponse = await fetch(url, {
             ...options,
             headers
         });

         if (dataResponse.status === 401) {
             localStorage.removeItem(options.key);
             await  setupToken({url: options.key});
            
         }


         if (dataResponse.status === 204) {
             return {
                 status: dataResponse.status
             }
         }


         if (!dataResponse.ok) {
           const res = await dataResponse.json();
             
             if (res) {
                 const result = res;

                 return {
                     error: result[0],
                     status: dataResponse.status
                 }
             } else {

                 return {
                     status: dataResponse.status
                 }
             }
         }

         const data = await dataResponse.json();
         return data;
     } catch (error) {
         return error
     }
 }

 async function loadScript(){
  await  setupToken({url: urlConsulta});
   await  setupToken({url: urlIndicacao});
   
 }

 

 const apiindicacao = authFetch;

Webflow.push(function () {

const subjects = {
 adesao: 2,
 aporte: 3,
 portabilidade: 4
};

const $forwardButton = $(".next-button");
const $backButton = $(".link-back");
const $submitButton = $("#Submit");

const tabsClass = "multistep-tabs";
const paneClass = "multistep-tab-pane";
const linkClass = "multistep-tab-link";
const successMessage = document.querySelector(".success-message");
const indicarNovamente = document.getElementById("indicar-novamente");
successMessage.style.display = "none";

loadScript();

const loadingIcon = document.querySelector(
 '#plano-cv1-modal #loading-icon-cv-plan'
);

const preloader = document.querySelector("#plano-cv1-modal .preloader");
const formBlock = document.querySelector("#plano-cv1-modal .form-block");
const form = document.querySelector("#plano-cv1-modal .form");
const formErrorMessage = document.querySelector(
 '#plano-cv1-modal .w-form-fail'
);

document.querySelector(
 '#refer-friend-tab2 .gc-button.w-inline-block'
).style.display = 'none';

formBlock.style.minWidth = "100%";
loadingIcon.style.display = "block";
loadingIcon.style.background = "#28343e";
loadingIcon.style.padding = "10px";
loadingIcon.style.borderRadius = "6px";
loadingIcon.style.boxShadow =
 '0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.2)';

preloader.style.display = 'none';
preloader.style.opacity = 1;
preloader.style.justifyContent = 'center';
preloader.style.top = 0;
preloader.style.left = 0;
preloader.style.width = '100%';
preloader.style.height = '300px';

indicarNovamente.addEventListener('click', () => {
 successMessage.style.display = 'none';
 document.getElementById("nome-amigo").value = "";
 document.getElementById("email").value = "";
 getElement("#refer-friend-tab2").style.display = "block";
 document.querySelector('.multistep-tabs-content').style.display = 'block';
});

const btnCloseIndicacao = document.querySelectorAll('.btn-close-indicacao');

btnCloseIndicacao.forEach(item => {
 item.addEventListener('click', () => {
   window.location.reload();
 });
});

successMessage.style.display = 'none';

const fields = $("input, select, textarea").not(
 ":input[type=button], :input[type=submit], :input[type=reset]"
);

let usrStore = JSON.parse(localStorage.getItem("usr"));
let usr = usrStore ? usrStore : {};

printUsr();
for (let index = 0; index < fields.length; index++) {
 const field = fields[index];

 $(field).on('blur change', saveUsr);
}

$backButton.on("click", moveBackward);
$submitButton.on("click", submitForm);

function moveForward(el) {
 el.preventDefault();

 const $target = $(el.currentTarget);
 const currentTab = $target.closest('.' + paneClass);
 const tabIndex = $target
   .closest('.' + tabsClass)
   .data('current')
   .split(' ')[1];

 let nextIndex = parseInt(tabIndex) + 1;

 let valid = validateFields(currentTab);
 if (valid) {
   $target.closest('.' + tabsClass).data('current', 'Tab ' + nextIndex);
   $('.' + linkClass).removeClass('w--current');
   $($('.' + linkClass)[nextIndex - 1]).addClass('w--current');
   $('.' + paneClass).removeClass('w--tab-active');
   $($('.' + paneClass)[nextIndex - 1]).addClass('w--tab-active');
 }
}

function moveBackward(el) {
 el.preventDefault();

 const $target = $(el.currentTarget);
 const currentTab = $target.closest('.' + paneClass);
 const tabIndex = $target
   .closest('.' + tabsClass)
   .data('current')
   .split(' ')[1];

 let nextIndex = parseInt(tabIndex) - 1;

 let valid = validateFields(currentTab);
 if (valid) {
   $target.closest('.' + tabsClass).data('current', 'Tab ' + nextIndex);
   $('.' + linkClass).removeClass('w--current');
   $($('.' + linkClass)[nextIndex - 1]).addClass('w--current');
   $('.' + paneClass).removeClass('w--tab-active');
   $($('.' + paneClass)[nextIndex - 1]).addClass('w--tab-active');
 }
}

function validateFields(currentTab) {
 let requiredFields = $(currentTab).find(
   'input[required], select[required], textarea[required]'
 );
 let required = true;

 $('.required-field').remove();

 for (let index = 0; index < requiredFields.length; index++) {
   const $requiredField = $(requiredFields[index]);

   if (!$requiredField.val()) {
     $requiredField.after(
       '<div class="required-field">The ' +
         $requiredField.attr('name').replace(/-/g, ' ') +
         ' field is required.</div>'
     );

     required = false;
   }
 }
 return required;
}

function saveUsr(el) {
 const $el = $(el.currentTarget);
 let val = $el.val();
 const name = $el.data('name');
 const type = $el.attr('type');
 const fieldTab = $el.data('ftab') ? parseInt($el.data('ftab')) - 1 : '';

 if (val) {
   $el.next('.required-field').remove();
 }

 usr[name] = type === 'checkbox' ? $el.prop('checked') : val;

 localStorage.setItem('usr', JSON.stringify(usr));
}

function printUsr() {

 for (let index = 0; index < fields.length; index++) {
   const field = fields[index];
   const fieldType = fields[index].type;
   const fieldName = $(field).data('name');
   const fieldTab = parseInt($(field).data('ftab')) - 1;

   if (fieldType !== 'checkbox') {
     $(field).val(usr[fieldName]);
   } else {
     if (usr[fieldName]) {
       $(field).prop('checked', true);
       $(field).prev().addClass('w--redirected-checked');
     }
   }
 }
}

$(document).ready(function ($) {
 
 document.getElementById("nome-amigo").value = "";
document.getElementById("email").value = "";
 document.getElementById("cpf-form-2").value = "";
 document.getElementById("Assunto").value = "";
 $("#cpf-form-2").mask("999.999.999-99")

 });

async function submitForm(e) {
 e.preventDefault();

 let hasErrors = false;
 $('.required-field').remove();

 const name = document.getElementById("nome-amigo");
 const email = document.getElementById("email");
 const cpf = document.getElementById("cpf-form-2");
 const subject = document.getElementById("Assunto");

 const requiredFields = [name, email, subject];

 for (let index = 0; index < requiredFields.length; index++) {
   const $requiredField = $(requiredFields[index]);

   if (!$requiredField.val()) {
     $requiredField
       .parent('.c-input-field')
       .after(
         '<div class="required-field" style="margin-top: -2.5rem; color: #e74c3c;">Campo Obrigatório</div>'
       );

     hasErrors = false;
   }
 }

 if (hasErrors) {
   return;
 }

 const formData = {
   nome: name.value,
   nomeEmail:email.value,
   indicacao: subject.value,
   cpfIndicando:cpf.value.replace(/\./g, "").replace("-",""),
 };


const response =  await apiindicacao("https://apiindicacaoplano.capef.com.br/CV/criar", {
   key: "https://apiindicacaoplano.capef.com.br",
    headers: {
     'Content-Type': 'application/json'
   },
   method: "POST",
   body: JSON.stringify(formData),
 });

 if(response.id){
     localStorage.removeItem("usr");
     document.querySelector(".multistep-tabs-content").style.display =
       "none";
     successMessage.style.display = "block";
 }else{
    errorMessageFormIndicar.style.display = "block";
   getElement("#inner-error-message").innerHTML = response.error;
 
 }  
   
}


const cpf = getElement("#cpf-form-2");
const loadingIconCVPlan = getElement("#loading-icon-cv-plan");
const formCVPlan = getElement("#form-cv-plan");
const errorMessageFormIndicar = getElement("#refer-friend-error-message");

function getElement(selector) {
 return document.querySelector(selector);
}

document.addEventListener("DOMContentLoaded", () => {

 function alphaOnly(event) {
   var value = String.fromCharCode(event.which);
   var pattern = new RegExp(/[a-zA-Z]/i);
   return pattern.test(value);
 }

 $('#email').bind('keypress', alphaOnly);
});

const getRequestOptions4 = accessToken => {
 return {
   method: 'GET',
   headers: {
     Accept: 'application/json',
     Authorization: `Bearer ${accessToken}`
   },
   redirect: 'follow'
 };
};

async function checkCPF(cpf) {
     const response = await apiindicacao(`https://apiconsulta.capef.com.br/CPF/${cpf.replace(/\./g, "").replace("-","")}`, { key:  "https://apiconsulta.capef.com.br"});
     if(response.valido){
       await setupToken({ url: urlIndicacao });
       return true;
     }else{
       return false;
     }
 }

getElement('#cpf-form-2-submit').addEventListener('click', async () => {
 formCVPlan.style.display = 'none';
 preloader.style.display = 'flex';
 form.style.justifyContent = 'center';
 formErrorMessage.style.display = 'none';
 errorMessageFormIndicar.style.display = "none";

 const validate = await checkCPF(cpf.value);

 if (validate) {
   getElement("#tab1").style.display = "none";
   getElement("#refer-friend-tab2").style.display = "block";

 } else {

   errorMessageFormIndicar.style.display = "block";

   getElement("#inner-error-message").innerHTML =
     validate && validate[0] ? validate[0] : "Erro ao encontrar CPF";
 }

 preloader.style.display = 'none';
 form.style.justifyContent = 'initial';
 formCVPlan.style.display = 'block';
});


});