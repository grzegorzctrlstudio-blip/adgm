/* CTRLstudio — ADGM SBE interactive presentation previsualization.
 * Zone silhouettes traced from the client's page-14 approved top-view map.
 * LED perspective mapping follows the user's latest supplied oblique render.
 * These display coordinates are not georeferenced GIS boundaries.
 */
window.ADGM_EXPERIENCE={
  zones:{
    M:{
      num:'01',name:'Al Maryah Island',tagline:'Financial and business district',
      subtitle:'ADGM Square, offices, healthcare and retail',
      x:.307,y:.393,zoom:1.59,color:'#6bd8ff',
      tabletPath:'M 169 8 C 178 12 182 22 178 31 C 170 45 162 58 160 77 C 159 96 158 117 155 134 C 151 155 150 176 144 193 C 139 206 132 212 126 207 C 113 195 109 177 108 157 C 107 135 113 118 121 106 C 121 83 122 66 131 47 C 139 29 152 17 169 8 Z',
      ledPath:'M 240 179 C 272 161 299 173 333 184 C 367 197 394 226 418 248 C 456 267 489 304 512 345 C 535 381 555 405 583 448 C 569 475 544 493 507 510 C 466 516 421 516 384 503 C 339 482 300 449 278 406 C 251 358 231 305 222 263 C 220 226 227 195 240 179 Z',
      markers:[
        {code:'M01',x:26.7,y:36.8,caption:'Al Sila Tower'},
        {code:'M02',x:29.6,y:43.1,caption:'Al Khatem Tower'},
        {code:'M03',x:31.9,y:46,caption:'Al Sarab Tower'},
        {code:'M07',x:34,y:54.6,caption:'The Galleria'}
      ]
    },
    T:{
      num:'02',name:'Marina Square',tagline:'Waterfront and mixed-use',
      subtitle:'Residential towers and waterfront destinations',
      x:.538,y:.625,zoom:1.66,color:'#5ce8d6',
      tabletPath:'M 199 144 C 207 145 220 148 229 150 L 245 144 C 253 147 260 150 261 161 L 262 187 C 264 197 261 214 251 220 C 230 208 216 204 198 202 Z',
      ledPath:'M 644 446 C 693 434 727 435 762 443 C 797 448 820 456 846 468 C 875 461 919 459 955 480 C 988 493 1010 522 1020 558 L 997 615 C 983 645 941 670 914 680 C 866 691 805 699 755 693 C 699 673 665 646 642 600 L 625 549 C 622 498 629 463 644 446 Z',
      markers:[
        {code:'T01',x:48,y:65,caption:'Marina Square'},
        {code:'T02',x:59.2,y:59,caption:'Addax Tower (kontekst)'},
        {code:'T03',x:53.4,y:56.8,caption:'Retail — do potwierdzenia'}
      ]
    },
    S:{
      num:'03',name:'Shams Abu Dhabi',tagline:'Northern district',
      subtitle:'Gate Towers, Sky/Sun and public destinations',
      x:.445,y:.305,zoom:1.57,color:'#87adff',
      tabletPath:'M 250 14 C 267 7 281 10 298 16 C 320 23 330 37 340 48 C 358 61 377 76 383 88 C 384 99 373 113 361 119 C 347 122 337 134 331 150 C 322 168 324 179 308 194 C 294 204 278 210 268 200 C 261 187 260 165 253 152 C 243 132 237 118 230 92 C 223 75 221 59 230 44 C 238 30 236 24 250 14 Z',
      ledPath:'M 416 108 C 459 84 514 74 560 72 C 621 69 697 79 743 88 C 785 94 814 113 831 147 L 829 193 C 815 219 804 253 806 283 C 820 315 844 349 854 376 C 844 401 817 414 784 421 C 744 410 719 389 693 366 C 657 344 638 318 615 284 C 583 253 570 228 538 213 C 491 203 453 194 427 176 C 409 154 409 132 416 108 Z',
      markers:[
        {code:'S01',x:48.9,y:38,caption:'Gate Towers'},
        {code:'S02',x:52.5,y:41.2,caption:'The Arc'},
        {code:'S03',x:37.2,y:22.1,caption:'Sky Tower (pozycja poglądowa)'},
        {code:'S04',x:41.1,y:26.7,caption:'Sun Tower (pozycja poglądowa)'}
      ]
    },
    N:{
      num:'04',name:'Najmat Abu Dhabi',tagline:'Southern waterfront',
      subtitle:'Waterfront development, mall and landmarks',
      x:.756,y:.681,zoom:1.53,color:'#9ed9ff',
      tabletPath:'M 251 213 C 265 197 275 195 291 207 C 311 219 342 214 365 215 C 388 227 406 221 430 229 C 441 246 444 271 442 293 C 435 320 415 347 400 366 L 330 366 C 310 347 281 326 259 315 C 237 307 231 293 214 282 C 222 270 232 263 240 273 C 254 280 258 263 243 255 C 231 252 220 255 211 248 C 221 234 235 218 251 213 Z',
      ledPath:'M 874 462 C 904 465 934 478 958 482 C 989 479 1031 487 1056 502 C 1087 500 1134 505 1175 514 C 1235 526 1301 528 1350 546 C 1390 562 1430 584 1456 615 C 1452 655 1444 703 1414 731 C 1368 750 1321 764 L 1236 758 C 1192 747 1143 736 1111 725 C 1062 718 1025 711 983 698 C 936 689 917 666 887 646 C 872 622 856 599 853 561 C 855 518 857 488 874 462 Z',
      markers:[
        {code:'N01',x:72,y:63.2,caption:'Reem Mall — kontekst'},
        {code:'N02',x:68,y:78,caption:'Najmat waterfront'},
        {code:'N03',x:80.2,y:70.9,caption:'The Wave / Aabar'}
      ]
    }
  },
  order:['M','T','S','N'],
  categories:[
    {id:'story',title:'Story',icon:'book-open',hint:'Narrative and approved zone video'},
    {id:'landmarks',title:'Landmarks',icon:'building-2',hint:'Building hotspots and descriptions'},
    {id:'clusters',title:'Business Clusters',icon:'chart-column',hint:'Sector-based stories after ADGM input'},
    {id:'services',title:'Services',icon:'settings',hint:'Service catalogue after ADGM input'}
  ]
};