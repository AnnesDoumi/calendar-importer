(function(){"use strict";var e={9978:function(e,t,n){var a=n(5130),r=n(6768);const i={id:"app"};function o(e,t,n,a,o,s){const l=(0,r.g2)("router-link"),d=(0,r.g2)("router-view");return(0,r.uX)(),(0,r.CE)("div",i,[(0,r.Lk)("nav",null,[(0,r.bF)(l,{to:"/"},{default:(0,r.k6)((()=>t[1]||(t[1]=[(0,r.eW)("Home")]))),_:1}),t[4]||(t[4]=(0,r.eW)(" | ")),(0,r.Lk)("button",{onClick:t[0]||(t[0]=(...e)=>s.authenticateGoogle&&s.authenticateGoogle(...e))},"Authenticate with Google"),(0,r.bF)(l,{to:"/privacy-policy"},{default:(0,r.k6)((()=>t[2]||(t[2]=[(0,r.eW)("Datenschutzbestimmungen")]))),_:1}),(0,r.bF)(l,{to:"terms-of-use"},{default:(0,r.k6)((()=>t[3]||(t[3]=[(0,r.eW)("Nutzungsbestimmungen")]))),_:1})]),(0,r.bF)(d)])}var s={name:"App",methods:{authenticateGoogle(){window.location.href="http://localhost:3000/auth/google"}}},l=n(1241);const d=(0,l.A)(s,[["render",o]]);var u=d,c=n(1387),h=n.p+"img/logo.12a2c6f6.png";const g={id:"app"},m={class:"upload-section"},f={key:0,class:"modal"},p={class:"modal-content"},b={ref:"video",width:"320",height:"240",autoplay:""},v={class:"calendar-buttons"},k={key:0,class:"data-table"},D=["onMouseover","onMouseleave"],L={class:"row"},w=["onClick"],y=["onUpdate:modelValue"],z=["onUpdate:modelValue"],C=["onUpdate:modelValue"],S=["onUpdate:modelValue"],E=["onUpdate:modelValue"],I=["onUpdate:modelValue"],A=["onUpdate:modelValue"];function T(e,t,n,i,o,s){return(0,r.uX)(),(0,r.CE)("div",g,[t[9]||(t[9]=(0,r.Lk)("img",{src:h,alt:"Logo",class:"logo"},null,-1)),t[10]||(t[10]=(0,r.Lk)("h1",null,"Calendar Importer",-1)),t[11]||(t[11]=(0,r.Lk)("h2",null,"Upload a screenshot of your Schedule",-1)),t[12]||(t[12]=(0,r.Lk)("br",null,null,-1)),t[13]||(t[13]=(0,r.Lk)("br",null,null,-1)),(0,r.Lk)("div",m,[(0,r.Lk)("input",{type:"file",accept:"image/*",onChange:t[0]||(t[0]=(...e)=>s.handleFileUpload&&s.handleFileUpload(...e))},null,32),o.showCamera?((0,r.uX)(),(0,r.CE)("div",f,[(0,r.Lk)("div",p,[(0,r.Lk)("video",b,null,512),(0,r.Lk)("button",{onClick:t[1]||(t[1]=(...e)=>s.takePhoto&&s.takePhoto(...e))},"Capture Photo"),(0,r.Lk)("button",{onClick:t[2]||(t[2]=(...e)=>s.closeCameraModal&&s.closeCameraModal(...e))},"Close")])])):(0,r.Q3)("",!0),(0,r.Lk)("div",v,[(0,r.Lk)("button",{onClick:t[3]||(t[3]=(...e)=>s.importGoogleCalendar&&s.importGoogleCalendar(...e)),class:"google-button"}," Analyze File ")])]),t[14]||(t[14]=(0,r.Lk)("br",null,null,-1)),t[15]||(t[15]=(0,r.Lk)("br",null,null,-1)),t[16]||(t[16]=(0,r.Lk)("i",null,"Upload a screenshot of your schedule, it will get analyzed and put in to a table. Correct the data if needed, then create an import file for your calendar, or import it directly.",-1)),o.analysisData.length>0?((0,r.uX)(),(0,r.CE)("div",k,[t[8]||(t[8]=(0,r.Lk)("h2",null,"Analyzed Data",-1)),(0,r.Lk)("table",null,[t[7]||(t[7]=(0,r.Lk)("thead",null,[(0,r.Lk)("tr",null,[(0,r.Lk)("th",null,"Title"),(0,r.Lk)("th",null,"Start Date"),(0,r.Lk)("th",null,"Start Time"),(0,r.Lk)("th",null,"End Date"),(0,r.Lk)("th",null,"End Time"),(0,r.Lk)("th",null,"Location"),(0,r.Lk)("th",null,"Description")])],-1)),(0,r.Lk)("tbody",null,[((0,r.uX)(!0),(0,r.CE)(r.FK,null,(0,r.pI)(o.analysisData,((e,t)=>((0,r.uX)(),(0,r.CE)("tr",{key:t,onMouseover:t=>e.showDelete=!0,onMouseleave:t=>e.showDelete=!1},[(0,r.Lk)("td",null,[(0,r.Lk)("div",L,[e.showDelete?((0,r.uX)(),(0,r.CE)("button",{key:0,class:"delete-button",onClick:e=>s.removeRow(t)},"-",8,w)):(0,r.Q3)("",!0),(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t=>e.title=t,class:"centered-input"},null,8,y),[[a.Jo,e.title]])])]),(0,r.Lk)("td",null,[(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t=>e.startDate=t},null,8,z),[[a.Jo,e.startDate]])]),(0,r.Lk)("td",null,[(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t=>e.startTime=t},null,8,C),[[a.Jo,e.startTime]])]),(0,r.Lk)("td",null,[(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t=>e.endDate=t},null,8,S),[[a.Jo,e.endDate]])]),(0,r.Lk)("td",null,[(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t=>e.endTime=t},null,8,E),[[a.Jo,e.endTime]])]),(0,r.Lk)("td",null,[(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t=>e.location=t},null,8,I),[[a.Jo,e.location]])]),(0,r.Lk)("td",null,[(0,r.bo)((0,r.Lk)("input",{"onUpdate:modelValue":t=>e.description=t},null,8,A),[[a.Jo,e.description]])])],40,D)))),128))])]),(0,r.Lk)("div",null,[(0,r.Lk)("button",{onClick:t[4]||(t[4]=(...e)=>s.importToGoogleCalendar&&s.importToGoogleCalendar(...e)),class:"google-button"}," Import to Google Calendar "),(0,r.Lk)("button",{onClick:t[5]||(t[5]=e=>s.generateCSV(o.analysisData))},"Export to Google Calendar CSV")]),(0,r.Lk)("button",{class:"add-button",onClick:t[6]||(t[6]=(...e)=>s.addRow&&s.addRow(...e))},"+")])):(0,r.Q3)("",!0)])}n(4114),n(4603),n(7566),n(8721);var x=n(3216),G=n.n(x),R=n(788),O=n.n(R),W={data(){return{files:[],showCamera:!1,analysisData:[]}},methods:{handleFileUpload(e){const t=Array.from(e.target.files);this.files=t},openCameraModal(){this.showCamera=!0,navigator.mediaDevices.getUserMedia({video:!0}).then((e=>{this.$refs.video.srcObject=e}))},closeCameraModal(){this.showCamera=!1;const e=this.$refs.video,t=e.srcObject,n=t.getTracks();n.forEach((e=>e.stop())),e.srcObject=null},takePhoto(){const e=document.createElement("canvas"),t=this.$refs.video;e.width=320,e.height=240,e.getContext("2d").drawImage(t,0,0,320,240);const n=e.toDataURL("image/png");this.files.push(n),this.closeCameraModal()},async analyzeFile(e){try{if(0===this.files.length)return void console.error("No files uploaded");const t=this.files[0],n=await G().recognize(t,"eng",{logger:e=>console.log(e)});let a=n.data.text;console.log("Extracted text before cleaning:",a),a=this.cleanExtractedText(a),console.log("Cleaned extracted text:",a);const r=await O().post("/api/groq",{prompt:`${e}: ${a}`});console.log("API Full Response:",r),this.processApiResponse(r.data.completion)}catch(t){console.error("Error analyzing file",t)}},processApiResponse(e){if(!e||"string"!==typeof e)return void console.error("API response is missing or not in expected format");this.analysisData=[];const t=e.trim().split("\n"),n=t.slice(1),a=n.filter((e=>{const t=e.split(","),n=t[1]&&""!==t[1].trim(),a=t.some((e=>""!==e.trim())),r=t[0]?t[0].trim():"";return n&&a&&!r.toLowerCase().includes("session reset")})).map((e=>{const[t,n,a,r,i,o]=e.split(","),s=this.formatDate(n),l=this.formatDate(r||n),d=this.formatTime(a),u=this.formatTime(i);return{title:t.trim()||"Event",startDate:s||"",startTime:d||"",endDate:l||"",endTime:u||"",location:"",description:o?o.trim():""}}));this.analysisData=a.filter((e=>e.startDate))},addRow(){this.analysisData.push({title:"Event",startDate:"",startTime:"",endDate:"",endTime:"",location:"",description:""})},removeRow(e){this.analysisData.splice(e,1)},formatDate(e){const t=new Date(e);return isNaN(t)?"":t.toISOString().split("T")[0]},formatTime(e){if(!e)return"";const[t,n]=e.split(":");return t&&n?`${t.padStart(2,"0")}:${n.padStart(2,"0")}`:""},async importToGoogleCalendar(){try{const e=await O().post("/api/google-calendar-import",{events:this.analysisData});200===e.status&&alert("Events successfully imported to Google Calendar!")}catch(e){console.error("Error importing to Google Calendar",e),alert("Failed to import events. Please try again.")}},generateCSV(e){const t="Subject,Start Date,Start Time,End Date,End Time,Description\n"+e.map((e=>`${e.title},${e.startDate},${e.startTime},${e.endDate},${e.endTime},${e.description}`)).join("\n"),n=new Blob([t],{type:"text/csv"}),a=window.URL.createObjectURL(n),r=document.createElement("a");r.href=a,r.download="calendar_events.csv",r.click(),window.URL.revokeObjectURL(a)},cleanExtractedText(e){const t=/(?:https?:\/\/|www\.)\S+/i,n=/\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b/i,a=/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/,r=e.match(t),i=e.match(n),o=e.match(a),s=Math.min(r?r.index:1/0,i?i.index:1/0,o?o.index:1/0);return r&&s<1/0&&(e=e.substring(s)),e.replace(/[^\w\säöüÄÖÜß:,-./]/g,"").replace(/\s+/g," ").replace(/(\d+)[.,](\d+)/g,"$1:$2").replace(/(\d+)\s*-\s*(\d+)/g,"$1-$2").replace(/\s*([:,-])\s*/g,"$1").trim()},importGoogleCalendar(){const e='You are given text extracted from OCR. Your task is to extract only the data present in the text and format it for CSV export for Google Calendar, following the rules strictly.\n\n## Key Rules:\n\n### 1. **Date and Time Formatting**:\n   - **Dates** with their **Times** found in the OCR Text you get, should all be represented at least once in the table with all other rules I give also applying.\n   - **Start Time** and **End Time** should be analyzed from the OCR Text, recognizing the pattern of how the times are assigned to the dates in the data. In the most cases, the times will appear on the right side of a date until the next date starts.\n   - **Dates** should be formatted as `YYYY-MM-DD` (ISO format).\n   - **Times** should be formatted as `HH:MM` (24-hour format). If times are missing or invalid, leave the field blank.\n\n### 2. **Handling Overlapping or Redundant Time Ranges**:\n   - If a date has multiple overlapping or contiguous time periods (e.g., "06:24-11:00" and "11:30-14:51"), merge them into a single entry covering the full range (e.g., "06:24-14:51").\n   - Do **not** create multiple entries for the same date if the time periods can be merged.\n   - If there are **distinct non-overlapping time ranges**, such as separate shifts on the same day, treat them as separate entries (e.g., "06:24-11:00" and "15:00-18:00").\n\n### 3. **Consolidation of Entries**:\n   - Each entry should contain one distinct time range for a given date, consolidating any overlapping or contiguous time ranges.\n   - **Do not split** or create separate rows for time ranges that can be merged into one.\n\n### 4. **Eliminating Unnecessary Duplicate Entries**:\n   - Ensure that each date is represented **once** with the consolidated time range, without unnecessary repetitions.\n   - Avoid creating separate entries for the same time period in a date (e.g., if there are time declarations "06:30-10:30" and "11:00-15:00" and "06:30-15:00" for a single date, only use "06:30" as Start Time, and "15:00" as End Time).\n\n### 5. **Subject Assignment Based on Context**:\n   - Ensure that the subject is assigned correctly. For example, if the OCR states a date, the structure of the whole OCR should be analyzed, and the text (except for the times) found in the text for the date, should be used as the subject [see Example Output Structure(for reference) below].\n   - Use text that appears on the right side of a date, until the next date starts, as the subject.\n\n### 6. **Handling Invalid or Missing Times**:\n   - If time declarations in the OCR text for a date are totally missing, leave the Start Time and End Time fields blank.\n   - Do **not** infer times that are not explicitly present in the text.\n   - Do not mistake a missing Times for a date, as a missing times for another date, therefore recognize how the information is put in the OCR TEXT.\n\n### 7. **Session Reset**:\n   - After processing the OCR text, reset the session to ensure no confusion or data overlap occurs between different datasets.\n\n## Example Output Structure (for reference):\nSubject,Start Date,Start Time,End Date,End Time,Description\nSubject,YYYY-MM-DD,,YYYY-MM-DD,,"Event"\n(insert assigned Subject here),2024-10-21,06:24,2024-10-21,14:51,"Event"\n\n## OCR Text:\n';this.analyzeFile(e)},importAppleCalendar(){const e="<- Analyze this Data, extract it for a (.ics) apple calendar output, no addition information or commenting";this.analyzeFile(e)}}};const V=(0,l.A)(W,[["render",T],["__scopeId","data-v-4869991b"]]);var F=V,N=n(4232);const P={class:"privacy-policy container my-5"},U={class:"card shadow-sm"},M={class:"card-body"},j=["href"],B={class:"mt-3"},_=["href"],$=["href"],Y=["href"];function K(e,t,n,a,i,o){return(0,r.uX)(),(0,r.CE)("div",P,[(0,r.Lk)("div",U,[(0,r.Lk)("div",M,[t[10]||(t[10]=(0,r.Lk)("h1",{class:"card-title text-center mb-4"},"Datenschutzerklärung",-1)),t[11]||(t[11]=(0,r.Lk)("p",{class:"lead"}," Der Schutz Ihrer persönlichen Daten ist mir wichtig. Ich behandle Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung. Hier erfahren Sie, wie ich personenbezogene Daten im Zusammenhang mit der Nutzung der Google API auf dieser Website erhebe und verwende. ",-1)),t[12]||(t[12]=(0,r.Lk)("h2",{class:"mt-4"},"1. Verantwortlicher",-1)),(0,r.Lk)("p",null,[t[0]||(t[0]=(0,r.eW)(" Verantwortlich für die Datenverarbeitung auf dieser Website bin ich, der Betreiber der Seite: ")),t[1]||(t[1]=(0,r.Lk)("br",null,null,-1)),(0,r.Lk)("strong",null,(0,N.v_)(i.ownerName),1),t[2]||(t[2]=(0,r.Lk)("br",null,null,-1)),t[3]||(t[3]=(0,r.eW)(" Kontakt: ")),(0,r.Lk)("a",{href:"mailto:"+i.contactEmail},(0,N.v_)(i.contactEmail),9,j)]),t[13]||(t[13]=(0,r.Fv)('<h2 class="mt-4" data-v-522a0fbf>2. Erhebung und Speicherung personenbezogener Daten</h2><p data-v-522a0fbf> Bei der Nutzung dieser Website und der eingebundenen Funktionen der Google API können personenbezogene Daten erhoben und verarbeitet werden. Diese Daten werden genutzt, um Ihnen die angebotenen Dienste zur Verfügung zu stellen und die Website zu verbessern. </p><h2 class="mt-4" data-v-522a0fbf>3. Nutzung der Google API</h2><p data-v-522a0fbf> Diese Website nutzt die Google API, insbesondere für die Integration des Google Kalenders. Durch die Nutzung dieser API können bestimmte Informationen an Google übermittelt werden. </p><h2 class="mt-4" data-v-522a0fbf>4. Art der erhobenen Daten</h2><p data-v-522a0fbf> Je nach Nutzung und Interaktion mit der Google API können die folgenden Daten erhoben werden: </p><ul class="list-group list-group-flush" data-v-522a0fbf><li class="list-group-item" data-v-522a0fbf>IP-Adresse</li><li class="list-group-item" data-v-522a0fbf>Kalenderdaten (falls explizit von Ihnen importiert)</li><li class="list-group-item" data-v-522a0fbf>Nutzungsdaten (z. B. besuchte Seiten, angeklickte Links)</li><li class="list-group-item" data-v-522a0fbf>Geräteinformationen (z. B. Browsertyp, Betriebssystem)</li></ul>',7)),(0,r.Lk)("p",B,[t[4]||(t[4]=(0,r.eW)(" Die Erfassung dieser Daten erfolgt direkt durch Google und unterliegt deren Datenschutzrichtlinien. Weitere Informationen finden Sie unter: ")),(0,r.Lk)("a",{href:i.googlePrivacyLink,target:"_blank",rel:"noopener noreferrer",class:"text-primary"},"Google-Datenschutzbestimmungen",8,_),t[5]||(t[5]=(0,r.eW)(". "))]),t[14]||(t[14]=(0,r.Lk)("h2",{class:"mt-4"},"5. Zweck der Datenverarbeitung",-1)),t[15]||(t[15]=(0,r.Lk)("p",null," Die Nutzung der Google API erfolgt, um Ihnen als Nutzer zusätzliche Funktionen wie den Google Kalender-Import zur Verfügung zu stellen. Die Datenverarbeitung erfolgt auf Grundlage meines berechtigten Interesses gemäß Art. 6 Abs. 1 lit. f DSGVO, die Website nutzerfreundlich und funktional zu gestalten. ",-1)),t[16]||(t[16]=(0,r.Lk)("h2",{class:"mt-4"},"6. Übermittlung personenbezogener Daten an Google",-1)),(0,r.Lk)("p",null,[t[6]||(t[6]=(0,r.eW)(" Bei Nutzung der Google API können die erhobenen Daten an Google weitergegeben werden. Google verarbeitet diese Daten gemäß den eigenen Datenschutzbestimmungen, die Sie ")),(0,r.Lk)("a",{href:i.googlePrivacyLink,target:"_blank",rel:"noopener noreferrer",class:"text-primary"},"hier",8,$),t[7]||(t[7]=(0,r.eW)(" nachlesen können. "))]),t[17]||(t[17]=(0,r.Fv)('<h2 class="mt-4" data-v-522a0fbf>7. Speicherung und Löschung von Daten</h2><p data-v-522a0fbf> Ich speichere keine persönlichen Daten. Die hochgeladenen Bilder werden nur einmalig ausgewertet. Einbindung von Google API / GROQ LLAMA API ist vorhanden, und weitere Handhabung der Daten werden durch ihre Datenschutzbestimmungen festgehalten. </p><h2 class="mt-4" data-v-522a0fbf>8. Ihre Rechte</h2><ul class="list-group list-group-flush" data-v-522a0fbf><li class="list-group-item" data-v-522a0fbf>Recht auf Auskunft über die Verarbeitung Ihrer Daten (Art. 15 DSGVO)</li><li class="list-group-item" data-v-522a0fbf>Recht auf Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li><li class="list-group-item" data-v-522a0fbf>Recht auf Löschung Ihrer Daten (Art. 17 DSGVO)</li><li class="list-group-item" data-v-522a0fbf>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li><li class="list-group-item" data-v-522a0fbf>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li><li class="list-group-item" data-v-522a0fbf>Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li></ul><h2 class="mt-4" data-v-522a0fbf>9. Änderungen dieser Datenschutzerklärung</h2><p data-v-522a0fbf> Diese Datenschutzerklärung kann gelegentlich aktualisiert werden, um gesetzlichen Anforderungen oder neuen Funktionen auf der Website zu entsprechen. Die jeweils aktuelle Version finden Sie auf dieser Seite. </p><h2 class="mt-4" data-v-522a0fbf>10. Kontakt</h2>',7)),(0,r.Lk)("p",null,[t[8]||(t[8]=(0,r.eW)(" Für Fragen zum Datenschutz oder zur Geltendmachung Ihrer Rechte erreichen Sie mich unter:")),t[9]||(t[9]=(0,r.Lk)("br",null,null,-1)),(0,r.Lk)("a",{href:"mailto:"+i.contactEmail,class:"btn btn-primary mt-2"},(0,N.v_)(i.contactEmail),9,Y)])])])])}var X={name:"PrivacyPolicy",data(){return{ownerName:"Annes Bani Al Doumi",contactEmail:"doumi.annes@gmail.com",googlePrivacyLink:"https://policies.google.com/privacy"}}};const H=(0,l.A)(X,[["render",K],["__scopeId","data-v-522a0fbf"]]);var J=H;const Z={class:"terms-of-use container my-5"},Q={class:"card shadow-sm"},q={class:"card-body"},ee=["href"],te=["href"];function ne(e,t,n,a,i,o){return(0,r.uX)(),(0,r.CE)("div",Z,[(0,r.Lk)("div",Q,[(0,r.Lk)("div",q,[t[4]||(t[4]=(0,r.Lk)("h1",{class:"card-title text-center mb-4"},"Nutzungsbedingungen",-1)),t[5]||(t[5]=(0,r.Lk)("p",{class:"lead"}," Willkommen auf meiner Website! Durch den Zugriff und die Nutzung dieser Website erklären Sie sich mit den folgenden Nutzungsbedingungen einverstanden. Bitte lesen Sie diese sorgfältig durch, bevor Sie unsere Dienste in Anspruch nehmen. ",-1)),t[6]||(t[6]=(0,r.Lk)("h2",{class:"mt-4"},"1. Allgemeines",-1)),t[7]||(t[7]=(0,r.Lk)("p",null," Diese Nutzungsbedingungen regeln die Nutzung unserer Website und der über sie angebotenen Dienste. Durch den Zugriff auf diese Website stimmen Sie zu, sich an diese Bedingungen zu halten. ",-1)),t[8]||(t[8]=(0,r.Lk)("h2",{class:"mt-4"},"2. Nutzung der Google API und anderer externer Dienste",-1)),(0,r.Lk)("p",null,[t[0]||(t[0]=(0,r.eW)(" Diese Website verwendet die Google API, um Ihnen spezifische Funktionen wie den Import von Kalenderdaten bereitzustellen. Durch die Nutzung dieser Dienste erklären Sie sich mit den Nutzungsbedingungen von Google einverstanden, die Sie ")),(0,r.Lk)("a",{href:i.googleTermsLink,target:"_blank",rel:"noopener noreferrer",class:"text-primary"},"hier",8,ee),t[1]||(t[1]=(0,r.eW)(" einsehen können. "))]),t[9]||(t[9]=(0,r.Fv)('<h2 class="mt-4" data-v-30c0cbcb>3. Haftungsausschluss</h2><p data-v-30c0cbcb> Ich übernehme keine Verantwortung für direkte oder indirekte Schäden, die durch die Nutzung dieser Website oder der hier angebotenen Dienste entstehen könnten. Ich bemühe mich, die Website und die angebotenen Inhalte aktuell und korrekt zu halten, übernehme jedoch keine Gewähr für deren Richtigkeit, Vollständigkeit oder Aktualität. </p><h2 class="mt-4" data-v-30c0cbcb>4. Benutzerverhalten</h2><p data-v-30c0cbcb> Sie verpflichten sich, die Website nur für legale Zwecke und in einer Weise zu nutzen, die keine Rechte anderer verletzt oder die Nutzung und den Betrieb der Website einschränkt. Es ist untersagt, die Website zu nutzen, um Inhalte zu verbreiten, die gegen geltendes Recht verstoßen oder die Rechte Dritter beeinträchtigen. </p><h2 class="mt-4" data-v-30c0cbcb>5. Geistiges Eigentum</h2><p data-v-30c0cbcb> Die auf dieser Website bereitgestellten Inhalte, einschließlich Texte, Bilder und Software, sind, sofern nicht anders angegeben, mein geistiges Eigentum oder das geistige Eigentum meiner Partner. Sie dürfen ohne meine ausdrückliche Zustimmung nicht vervielfältigt, weitergegeben oder veröffentlicht werden. </p><h2 class="mt-4" data-v-30c0cbcb>6. Änderungen der Nutzungsbedingungen</h2><p data-v-30c0cbcb> Ich behalte mir das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Änderungen treten mit der Veröffentlichung der aktualisierten Bedingungen auf der Website in Kraft. Bitte überprüfen Sie diese regelmäßig, um über mögliche Änderungen informiert zu bleiben. </p><h2 class="mt-4" data-v-30c0cbcb>7. Beendigung der Nutzung</h2><p data-v-30c0cbcb> Ich behalte mir das Recht vor, Ihren Zugriff auf die Website und deren Dienste jederzeit und ohne Angabe von Gründen zu beenden, wenn gegen diese Nutzungsbedingungen verstoßen wird oder wenn ich dies aus rechtlichen oder betrieblichen Gründen für notwendig halte. </p><h2 class="mt-4" data-v-30c0cbcb>8. Kontakt</h2>',11)),(0,r.Lk)("p",null,[t[2]||(t[2]=(0,r.eW)(" Für Fragen oder Anmerkungen zu diesen Nutzungsbedingungen erreichen Sie mich unter:")),t[3]||(t[3]=(0,r.Lk)("br",null,null,-1)),(0,r.Lk)("a",{href:"mailto:"+i.contactEmail,class:"btn btn-primary mt-2"},(0,N.v_)(i.contactEmail),9,te)])])])])}var ae={name:"TermsOfUse",data(){return{contactEmail:"doumi.annes@gmail.com",googleTermsLink:"https://policies.google.com/terms"}}};const re=(0,l.A)(ae,[["render",ne],["__scopeId","data-v-30c0cbcb"]]);var ie=re;const oe=[{path:"/",name:"UploadComponent",component:F},{path:"/privacy-policy",name:"PrivacyPolicy",component:J},{path:"/terms-of-use",name:"TermsOfUse",component:ie}],se=(0,c.aE)({history:(0,c.LA)(),routes:oe});var le=se;(0,a.Ef)(u).use(le).mount("#app")}},t={};function n(a){var r=t[a];if(void 0!==r)return r.exports;var i=t[a]={exports:{}};return e[a].call(i.exports,i,i.exports,n),i.exports}n.m=e,function(){var e=[];n.O=function(t,a,r,i){if(!a){var o=1/0;for(u=0;u<e.length;u++){a=e[u][0],r=e[u][1],i=e[u][2];for(var s=!0,l=0;l<a.length;l++)(!1&i||o>=i)&&Object.keys(n.O).every((function(e){return n.O[e](a[l])}))?a.splice(l--,1):(s=!1,i<o&&(o=i));if(s){e.splice(u--,1);var d=r();void 0!==d&&(t=d)}}return t}i=i||0;for(var u=e.length;u>0&&e[u-1][2]>i;u--)e[u]=e[u-1];e[u]=[a,r,i]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var a in t)n.o(t,a)&&!n.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){n.p="/"}(),function(){var e={524:0};n.O.j=function(t){return 0===e[t]};var t=function(t,a){var r,i,o=a[0],s=a[1],l=a[2],d=0;if(o.some((function(t){return 0!==e[t]}))){for(r in s)n.o(s,r)&&(n.m[r]=s[r]);if(l)var u=l(n)}for(t&&t(a);d<o.length;d++)i=o[d],n.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return n.O(u)},a=self["webpackChunkcalendar_importer"]=self["webpackChunkcalendar_importer"]||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))}();var a=n.O(void 0,[504],(function(){return n(9978)}));a=n.O(a)})();
//# sourceMappingURL=app.48ed1b90.js.map