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
      x:.325,y:.402,zoom:1.68,color:'#6bd8ff',
      tabletPath:'M 180 14 C 168 17 153 41 137 77 C 125 106 122 144 121 181 C 119 210 120 252 130 264 C 141 281 154 275 170 253 C 181 236 185 203 191 166 C 198 124 206 90 207 59 C 206 34 192 18 180 14 Z',
      ledPath:'M 279 201 C 301 180 342 176 373 198 C 401 218 418 260 452 295 C 480 325 496 365 529 392 L 572 427 C 564 453 546 463 503 478 L 430 493 C 397 494 359 477 342 445 C 325 401 299 365 286 328 C 271 286 260 240 279 201 Z',
      markers:[
        {code:'M01',x:28.8,y:37,caption:'Al Sila Tower'},
        {code:'M05',x:38.9,y:45.6,caption:'ADGM Headquarters'},
        {code:'M07',x:34.8,y:55.2,caption:'The Galleria'},
        {code:'M08',x:42.4,y:49,caption:'Cleveland Clinic'}
      ]
    },
    T:{
      num:'02',name:'Marina Square',tagline:'Waterfront and mixed-use',
      subtitle:'Residential towers and waterfront destinations',
      x:.532,y:.604,zoom:1.72,color:'#5ce8d6',
      tabletPath:'M 196 179 L 215 176 L 243 182 L 262 190 L 265 219 L 273 243 L 245 252 L 213 245 L 194 239 Z',
      ledPath:'M 661 454 C 704 444 772 448 814 452 L 874 463 C 900 471 927 470 951 487 L 939 552 C 904 564 872 577 824 573 L 752 571 L 685 552 L 647 524 C 636 497 644 471 661 454 Z',
      markers:[
        {code:'T01',x:51.5,y:62.4,caption:'Marina Square'},
        {code:'T02',x:61.0,y:60.2,caption:'Addax Tower*'},
        {code:'T03',x:55.3,y:53.6,caption:'Retail cluster*'}
      ]
    },
    S:{
      num:'03',name:'Shams Abu Dhabi',tagline:'Northern district',
      subtitle:'Gate Towers, Sky/Sun and public destinations',
      x:.620,y:.367,zoom:1.62,color:'#87adff',
      tabletPath:'M 246 28 C 258 12 275 9 295 14 C 320 21 342 39 355 60 C 366 76 385 89 393 110 C 403 126 391 147 378 163 C 360 179 354 197 344 223 C 335 240 319 242 298 233 C 282 226 272 208 267 187 C 266 166 256 144 245 121 C 235 102 223 76 224 58 C 229 45 234 39 246 28 Z',
      ledPath:'M 785 203 C 819 200 858 220 889 224 C 918 230 940 247 971 253 L 1043 262 C 1096 274 1156 291 1191 322 C 1210 344 1188 366 1150 381 L 1077 404 C 1028 402 997 414 950 402 L 899 425 C 865 423 839 406 805 393 C 778 370 760 341 750 309 C 744 265 757 221 785 203 Z',
      markers:[
        {code:'S01',x:55.4,y:39.0,caption:'Gate Towers'},
        {code:'S02',x:59.2,y:41.3,caption:'The Arc'},
        {code:'S03',x:43.2,y:35.0,caption:'Sky Tower*'},
        {code:'S07',x:72.5,y:34.0,caption:'Reem Central Park'}
      ]
    },
    N:{
      num:'04',name:'Najmat Abu Dhabi',tagline:'Southern waterfront',
      subtitle:'Waterfront development, mall and landmarks',
      x:.716,y:.708,zoom:1.55,color:'#9ed9ff',
      tabletPath:'M 306 232 C 322 238 345 246 380 251 L 427 253 C 449 266 449 287 450 312 C 452 343 441 363 422 365 L 393 357 C 362 350 338 335 315 319 C 294 305 272 296 260 280 C 274 268 286 250 306 232 Z',
      ledPath:'M 951 511 C 1002 509 1060 519 1110 520 L 1190 534 C 1244 543 1298 548 1319 579 L 1321 627 C 1307 653 1283 685 1224 706 L 1140 701 C 1087 694 1035 679 991 647 C 957 631 936 602 924 570 C 924 541 933 519 951 511 Z',
      markers:[
        {code:'N01',x:71.1,y:60.9,caption:'Reem Mall*'},
        {code:'N02',x:63.1,y:79.3,caption:'Najmat waterfront'},
        {code:'N03',x:79.7,y:68,caption:'The Wave*'}
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