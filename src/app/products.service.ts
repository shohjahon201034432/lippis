import { Injectable, signal } from '@angular/core';

export interface Product {
  name: string;
  price: number;
  img: string;
  images: string[];
  category: string
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  classic = signal<Product[]>([
    {
      name: 'Classic Black Cap',
      price: 19.99,
      img: 'https://media.istockphoto.com/id/864713752/photo/baseball-hat.jpg?s=612x612&w=0&k=20&c=rSiZHY3_-km8Cx0fgFWWG3Rh2PlcAnFaFtJybApBq_s=',
      images: [
        'https://media.istockphoto.com/id/864713752/photo/baseball-hat.jpg?s=612x612&w=0&k=20&c=rSiZHY3_-km8Cx0fgFWWG3Rh2PlcAnFaFtJybApBq_s=',
        'https://media.istockphoto.com/id/526131500/photo/hat-on-white-background.jpg?s=612x612&w=0&k=20&c=wEaZqxqsCAsyhT-qsWh9QRxc1Eu0-kmkkfMJTdmS2qY=',
        'https://media.istockphoto.com/id/1151194505/photo/black-canvas-fabric-cap-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=yPiVzW0flwxlODb6ybwhp0AZdvJZfiG-Hn0P0HP23cE='
      ],
      category: 'classic'
    },
    {
      name: 'Classic Blue Cap',
      price: 21.99,
      img: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSEhIVFRUVFxUXFRUVFRcVFRUVFxUXFxUVFxUYHSggGBolHxcVIjEhJSkrLi4uGB8zODMtNygtLisBCgoKDg0OFxAQGDAmHyArKy0tLS0tKystLS0tLS0rLS0tLS0tKy0tLS0tKy0tLS0rLS0tLS0tLSstKy0tLS0tLf/AABEIAMwA9wMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAAAQIDBgcEBQj/xABFEAACAQEDBwkEBggGAwAAAAAAAQIDBBHwBRIhMUFRcQYHIjJhgZGhsRMUwdFScoKSsuEVI0JTYqLC8SUzNXODsyRDY//EABkBAQADAQEAAAAAAAAAAAAAAAABAgQDBf/EACkRAQACAgEDAwMEAwAAAAAAAAABAgMRBBIxUSEyQSJhcRMzgcEFFEL/2gAMAwEAAhEDEQA/AO4gAAAAAAAAAAAAAAAAAACtSoopuTSS1tu5LvZ46eWbNJ5sbRRb3KpBvwvJiJnsjcPcACEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAatyj5c2ayt0431qv7uDVy+tPVEtSlrzqsIm0V7tpIbu0s4/lDlxbKv/sVGP0KS03dtSWm/hcfAtOUJz0znKfbOTk/GTZtpwLz7p0zzyY+IdxtGWrNDr16S7M+N/gnefItPLqxw1TlP6sH6yuOPStBjdY714FI7zKk8i3xDa+X3KD35U4UnKnCDk5KV3SbuUXcr1o6XiaU8jOUtNZ/d/M9LrEQrdJadj+fwNVMVaV6Y7OM3tM7dA5KcsfdbNToVYzquCkvaZyvcc5uKuf0U0tew2qxctrHU0OUqb3Tjo8Y3rxONq047NTIVpeN6OF+Hjt69nSua8P0DZbZTqK+nUhNfwyUvQzn59jadN/bf3M99DLlaF2bXqx0vVUml4X3Ge3+Pn4s6RyfMO5g45ZeW1tg1dXVRfRqwi196N0vNm15B5xqNWSp2mPsJvQpZ19KT+t+z3+JnycTJT17/AIda5q2bwCEyTM6gAAAAAAAAAAAAAAAAAAEMk5tzn8rXD/wbPLpyX66S/Yg/2eOnTxS2u7pixzkt0wra0VjcvLy55dyqSlZbHK6K0Vay/DB/Hbw16LFqOhd71t9rZhglFXL829rfaQ5nuYsVcddQwXtNp3LK5mNVdLV2hNXO/rb3o1LiUzit50V0yuZXOKNlXIjadMmeU9p049/o9fYVcjFf0o/a4dWWP7ETKdPQ63bw9Ff6MhVe7Hw1GCbw/DT6PxKZ2PLT6Mrs09ir43Lau7WVrWtq5XLWr3e1jYeXPx6N+jGdjG4bTp7I2i9Xrj80WlO9NPSmeJVLtWHv7yyqY9UTtGnRObzls6Mo2S1SvpPRRqyfUeyEn9Ht2cOr1w/L82n36jrPNVyvdaPudeX62C/Vyf7cF+z2tLSuzgzzuXg/7r/LTiyfEujgA89oAAAAAAAAAAAAAAAAfJ5U5ajY7NOvK69K6Ce2b1LhtfYmfn91pTlKrUbc6jzpN69Om7172zcOdbLnt7QrPF9Ck2nc9cl136R8d5pecexxMXRXc95Y81+qdLuRUreReatuS15N5CIkxsHIqyGyrZGxLZTO6UftfheMIN4xj1MbfSj9r8LxjTWZSmpLGv8Av8UUePzxquZWUsfLG9Fc/HnjvRWZWXvx8/TwYvMV+MYuJvI2MjePgTfj4mLGPgWzsY2E7GSMjJStU6U4VqcnGcGmmtjTvT7mefH5BsIfpTkrluNss1OvHQ5K6cfozWiS+K7Gj65xXmXy57K0Sskn0aqvhf8AvIpteMU19lHajx82PovpspbcAAOS4AAAAAAAAAAB8nlRlX3Wy1K37SV0O2ctEfN39zPrHN+eLKF0aFBPW5VJd3Rh6z8Drgp15Iqpkt01mXKq1Vyqtttu7W98np9BeYYdeXCP9RkPcYUpkpkXACWRJkXhgVZVvGMeoljGO4i8qlEnjGPUpPrLjL8MteN5Z4xj4GN9aPf+F48Oy6spRPG/v3f2ZieMY08Szd2NH5r4cDG3jGNpWVk3hPGMbCAQL3i8oE8Y2jYveTeUvJROxnydbZUK9KtDrQkpLjF5y7tfifqOxWmNWnCpDTGcYyjwkr16n5QtDuSe6UfW74n6B5p8p+2sKpt9KjJw+y+lB8NLX2THy67rvx/brin103QAGBoAAAAAAAAAAAOGc5lv9rb6i2U82nH7Kvl/NKR3CrUUU5PUk2+CV7PzXlG0urUlUeucpTfGTbfqb+DX6pt4Z88+kQ8UetLhH4/MymCT6a7U/W8zHowzpvIvBBIsVky15hqMiRLkVvK3k3ldpHjHhjSqVH0l9rX9WWPHtvSeMY9DHLrR7/wvF35FZlMKTfx9d2z58SiljHf6ESePz4eXArfjGNTKTKzInjX/AH+RJjUiyeMY2DYsVYvIvAsWiUiZEiYQxWzq98fVHT+ZzKWZapUW9Fano+vT6S/lc/I5jaloS/ij6/kbFyWt3sLXQq36IVIN/VbzZ/ytlb16q2j7JidTEv0kADx2wAAAAAAAAAAHxOWtq9lYbTL/AOcorjPoL8R+e6us7VztWnNsOb+8q04+F9T+hHFKp6vCjWOZ8yyZ5+pgq64vtXnoM5gq9Xhp8HeZ0a47uSskLxURCQF2YJacYx2mapqMaWgiRRRJZJilUS1vGMbCvZKXjGPRmOWlrv7NFzxh3Y5WuC23mF22N/c/Hvx5lJtHlaIllksd+O/iRm4WMajBKuthaNTtxj5leqE6ZHHGMXcCrxjG8lSxjHiVvx6ATeSREtcBMTMjFFGZai8Ilgr64L+L0TPbDW+48clfOC+s/Q9MHp7ya95RL9McnLb7ey0Ku2dODf1s1Z3nefSNM5prZn2BQv00qlSHi/aL8ZuZ42WvTeY+7ZWdxEgAKLAAAAAAAAObc89boWaG+VSX3YxX9TOT1TpPPRU/XWeO6nUf3pRX9JzSoz2eLGsUMWX3yrKN8XwfoeiMTHFaFx9NJNSulo1vctLNEaUTOJWdWEdbXDb4EeylLrO7sWvvfyLwpRjqSXbt8dY9R56lWcurC5aNMnd5D3ab60+6Ku82eogdPk286sUNt74tl/dYfQj4IzIXE9MeEbl55WSH0I+CMbsFL93HwPW0VuKzWPCdy8UsnUvo3cG18TDLJkdjku+/1PotFWVnHXwnql8uVgmurJPjoMb9pHXBtdmk+s0QUnFHwt1PmQrxb3cfzM0D0zpRetI88rGlqbRHTMG4WRkR5lnrc/JmRVt96ESTCYdd9kV6v5GSmylFpuTT1pLzZMZaUiYJdd5krXf71S2J0pri8+MvwwOpHGeZKb97r7vY+aqRu+J2Y8zlfuy04vbAADO6AAAAAAAAOU87mTLRUtFOpTo1JwVFRzoQlNKWfNtPNTu0OOs5baqig82bzXul0X4M/VBitFmhUWbUhGa3SipLwZsx8uaViuuzjbDEzvb8ryTqXZskorane79tx7KNJRVyXzfFm285uT6NC25lClTpQ9lCTjThGEc5ud8s2KSvdy8DVUelimLVi3lmt6TpJLIRJ1UQAAAYxi4Y1EJQ12ehVxxcizxqIAo9f9yMbybsaURJ41lUqshksq8bSEpaKMuVeN4FJRvMUo3GdlZIrMJMn5Nq2ioqNnp59Wd+bFOMb7k5S0yaSuipPTuNyybzTZSk06js9Jbb6kpyXdCLT+8fP5tXdlSyv+OovGhVR+iTDyMtsdoiPDtjrFo9Wm8geQ/6OdWcqyqzqKK0QzFFJtvXJt33rdqNyAMVrzady7xERGoAAVSAAAAAAAAAADifO3/qH/DT9Zmmo3PncX+If8NP8UzTD3OP+3X8MOT3SkC4Npazu5hJ5HanJ5tOLnJ6lFNt9yPrWPkraqumrONGO7rz8E7vM43z0p3l0rjmXgnXitbR55ZQhvN0sfIeyL/MdSq/4p5q7lC5+Z9uy5CscOrZqXFwUn4yvZktzo+IdYweXK55VgQsqw34x8TssKFJaqVNcIRXwLSp03rpwf2I/Ip/vT4W/QhxuGUIMyKvF7jp9syFY6nXs1LioKD+9G5nwbbyDskv8uVSk+yWevCV78y1ebHzCs4PDT7iGfRtvI61UtNKcay3dSf3W7vM+JO0TpyzKsJQktkk0/B7DRTPS3ZSaTD1C4rConpRJ1UMdpVoteRjDA+/zef6lZf9x/8AXNH6KPzrzer/ABKy/wC4/wDrmfoo83m++Pw04e0gAMbsAAAAAAAAAAAAAOMc8MLrdF76FPyqVUaQjqHPPk5tULQlojnU5vdfdKF/Zoku9HKa1dRXbsPZ41o/ShiyR9cr2iuorSZsl5Gq2m6c26dLZ9KS7FsXa/M+hkTk7JtVbQtOuNN7Nzmt/Z47ltCpsy8jlzPpV1x4vmWDJthp0Y5tOCjve18Za2fQjIwxpmaMTDM77tDNFmSMjFFF0iBlUhnEJC4CHIxtl5Io0Bjkzw5QsdOtHNqwU12rSu1PWnwPbKJilEROhouVOSk6d8rNJyX7uT6Xc9UuD8z41O0ac2Sua0NNXNPt3HTpQZ8nLGQ6doV8lmzWqa6y7HvXY/I14uTNfSzlbFE9mnXjG4rb7FVs0s2qr4t9Ga0xl37H2PzIjNM9Cl4tG4Z5rMNo5tKTllOzdkqknwVGp8bj9CHG+ZXJcp2ipaWuhTg6cXsc5tN3cIrT9dHZDzuXbeTXiGjDH0gAMrqAAAAAAAAAAAAAMFtskK0JU6kVOEldKMlemjTlzfWShL2lGj0tjlKdRx+rnt3cUbwCYtMRqJRqGiVcjXbDA8lPcb7OhF7DzzsKIS0n9GvcP0c9xuMrD2FHYluA1NWB7iysT3G0+5LcPckBrHuTHuTNn9zQ9zQGruxPcVdhe42r3ND3JbgNTdge4r+jnuNu9yW4lWFbgNP/AEY9wWSXuNyjYFuM0LAgNLfJ6NSLhOClF64yV6fczBYuaqxOWc4VFH6KqzUfXO8zodOzxWwylq3tXtKJiJ7vNk6wUqFONKjCMIR1Rirl29/aekAqkAAAAAAAAAAAAAAAAAAAAACLiQBGaiMxFgBXMRHs0XAFcxDMRYARmoXEgAAAAAAAAAAAAAAAAD//2Q==',
      images: [
        'data:image/jpeg;base64,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',
        'https://media.istockphoto.com/id/182241866/photo/blue-baseball-cap.jpg?s=612x612&w=0&k=20&c=GVu1dRfkwQzG6Q-ZXab22Z_I4KEBHgqjPx918Ehvugc=',
        'https://media.istockphoto.com/id/1038618324/photo/blue-hat-isolated.jpg?s=612x612&w=0&k=20&c=6Tc7ExzKhb8XdvZWIMe6EI41R6Ru_v6oEpB29vwbGWE=',
      ],
      category: 'classic'
    },
    {
      name: 'Classic Red Cap',
      price: 20.99,
      img: 'https://media.istockphoto.com/id/474219511/photo/red-baseball-cap.jpg?s=612x612&w=0&k=20&c=QOMxnZTkgTpGcyA6TM1Ty5BwUbRKnTz8DVPDkrEQfqs=',
      images: [
        'https://media.istockphoto.com/id/474219511/photo/red-baseball-cap.jpg?s=612x612&w=0&k=20&c=QOMxnZTkgTpGcyA6TM1Ty5BwUbRKnTz8DVPDkrEQfqs=',
        'https://media.istockphoto.com/id/613516352/photo/red-baseball-cap.jpg?s=612x612&w=0&k=20&c=nFHaUAMp7YFPuTFfBkyQmwTbRBSkIAEOsNRW-ZZKTy8=',
        'https://media.istockphoto.com/id/687059378/photo/red-hat.jpg?s=612x612&w=0&k=20&c=xWLiXRXce9qxjt_LLeJbsbMmgZu4ywIlyZIyJSpZLRw=',
      ],
      category: 'classic'

    },
    {
      name: 'Classic White Cap',
      price: 18.99,
      img: 'https://media.istockphoto.com/id/898398692/photo/white-hat.jpg?s=612x612&w=0&k=20&c=8wlK0AnL7TqE7Y3p7TLO3joj9---IapYK-_Tn_QVbqs=',
      images: [
        'https://media.istockphoto.com/id/898398692/photo/white-hat.jpg?s=612x612&w=0&k=20&c=8wlK0AnL7TqE7Y3p7TLO3joj9---IapYK-_Tn_QVbqs=',
        'https://media.istockphoto.com/id/1248211740/photo/cap-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=efPkV4qfX2bPmqN07-PtaYerR-MZZvUwFd-DORzGCAY=',
        'https://media.istockphoto.com/id/1151188517/photo/white-canvas-fabric-cap-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=dwwQ8KJAJg-_es7JATr8fGJxeUgfRZ9bV2k4ZhMmLlw=',
      ],
      category: 'classic'

    },
    {
      name: 'Classic Yellow Cap',
      price: 22.99,
      img: 'https://media.istockphoto.com/id/2211895349/photo/stylish-yellow-baseball-cap-isolated-on-white-mockup-for-design.jpg?s=612x612&w=0&k=20&c=Nsp_rGL7Aq7ZQyMA0VMz9LRyCbM3ZYwEgL3qhcV37Lw=',
      images: [
        'https://media.istockphoto.com/id/2211895349/photo/stylish-yellow-baseball-cap-isolated-on-white-mockup-for-design.jpg?s=612x612&w=0&k=20&c=Nsp_rGL7Aq7ZQyMA0VMz9LRyCbM3ZYwEgL3qhcV37Lw=',
        'https://media.istockphoto.com/id/2215790684/photo/stylish-yellow-baseball-cap-isolated-on-white-mockup-for-design.jpg?s=612x612&w=0&k=20&c=5Ct9KDxHYhmMtwNaeaqpqOjxYfROSihm-0AJEqkbjRo=',
        'https://media.istockphoto.com/id/2211895358/photo/stylish-yellow-baseball-cap-isolated-on-white-mockup-for-design.jpg?s=612x612&w=0&k=20&c=bies6VcgFuX328MFHgEywFEoMRXwf9GlAC26IVDUXRQ=',
      ],
      category: 'classic'

    },
    {
      name: 'Classic Olive Cap',
      price: 19.49,
      img: 'https://media.istockphoto.com/id/2215790666/photo/one-stylish-baseball-cap-isolated-on-white-mockup-for-design.jpg?s=612x612&w=0&k=20&c=NgbCFyOOOzWDME35bmLu6QN-rC_OQyk6TKgxXco2KeQ=',
      images: [
        'https://media.istockphoto.com/id/2215790666/photo/one-stylish-baseball-cap-isolated-on-white-mockup-for-design.jpg?s=612x612&w=0&k=20&c=NgbCFyOOOzWDME35bmLu6QN-rC_OQyk6TKgxXco2KeQ=',
        'https://media.istockphoto.com/id/2215790681/photo/one-stylish-baseball-cap-isolated-on-white-mockup-for-design.jpg?s=612x612&w=0&k=20&c=Dto6VIrJC4VopgNSxCqAj3jjgPq6tt2hPqDyanWHYIU=',
      ],
      category: 'classic'

    },
  ]);

  snapback = signal<Product[]>([
    {
      name: 'Snapback White Logo',
      price: 24.99,
      img: 'https://media.istockphoto.com/id/636241652/photo/white-empty-baseball-cap.jpg?s=612x612&w=0&k=20&c=QjABC7pfgMAfUxcddaQT1TaOKc8kho0cR2Yl65CJRYI=',
      images: [
        'https://images.pexels.com/photos/16843089/pexels-photo-16843089/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843094/pexels-photo-16843094/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843098/pexels-photo-16843098/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      category: 'snapback'

    },
    {
      name: 'Snapback Red Script',
      price: 26.99,
      img: 'https://media.istockphoto.com/id/909956104/photo/red-baseball-cap-mock-up-blank-hat-template-isolated-on-white-background-3d-rendering.jpg?s=612x612&w=0&k=20&c=dpNrOe_a-1kVZUUIXn3JHNgJ3CHIzAsIcmDpFzOgA4I=',
      images: [
        'https://images.pexels.com/photos/9733276/pexels-photo-9733276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/9733277/pexels-photo-9733277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/9733278/pexels-photo-9733278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      category: 'snapback'

    },
    {
      name: 'Snapback White Classic',
      price: 23.49,
      img: 'https://media.istockphoto.com/id/1220512492/photo/blank-white-jeans-snapback-mockup-side-view.jpg?s=612x612&w=0&k=20&c=LGkJF-z6wPsyoGDf5vI1DLcVevvMmlNlt48PwK57wpk=',
      images: [
        'https://images.pexels.com/photos/16843089/pexels-photo-16843089/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843094/pexels-photo-16843094/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843098/pexels-photo-16843098/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      category: 'snapback'

    },
    {
      name: 'Snapback Black Tag',
      price: 25.99,
      img: 'https://media.istockphoto.com/id/1184218578/vector/vector-3d-realistic-render-black-blank-baseball-snapback-cap-icon-closeup-isolated-on-white.jpg?s=612x612&w=0&k=20&c=3OzJaWF2qCbYoJzwrlRO3w4IbHta1Bn7Jc4HG0QcenU=',
      images: [
        'https://images.pexels.com/photos/16843075/pexels-photo-16843075/free-photo-of-a-man-with-a-black-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843080/pexels-photo-16843080/free-photo-of-a-man-with-a-black-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843085/pexels-photo-16843085/free-photo-of-a-man-with-a-black-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      category: 'snapback'

    },
    {
      name: 'Snapback Camo',
      price: 28.99,
      img: 'https://media.istockphoto.com/id/184351921/photo/baseball-trucker-cap.jpg?s=612x612&w=0&k=20&c=XvZl1rZPdfSVPO6APSHQpVSx65CECjTw01Qm-4j8Otk=',
      images: [
        'https://images.pexels.com/photos/20349911/pexels-photo-20349911/free-photo-of-grey-cap-on-a-white-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/20349912/pexels-photo-20349912/free-photo-of-back-of-a-grey-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/20349913/pexels-photo-20349913/free-photo-of-front-view-of-a-grey-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      category: 'snapback'

    },
    {
      name: 'Snapback Grey Urban',
      price: 22.49,
      img: 'https://media.istockphoto.com/id/1480922000/photo/side-view-realistic-cap-mock-up-in-green-khaki-texture-is-a-high-resolution-hat-mockup-to.jpg?s=612x612&w=0&k=20&c=v36a3Qg7ttnP2E3GmoMr-NODcsXgy3ekwX9fuldgwe8=',
      images: [
        'https://images.pexels.com/photos/20349911/pexels-photo-20349911/free-photo-of-grey-cap-on-a-white-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/20349912/pexels-photo-20349912/free-photo-of-back-of-a-grey-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/20349913/pexels-photo-20349913/free-photo-of-front-view-of-a-grey-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      category: 'snapback'

    },
  ]);

  truck = signal<Product[]>([
    {
      name: 'Truck Mesh Green',
      price: 17.99,
      img: 'https://media.istockphoto.com/id/1480922000/photo/side-view-realistic-cap-mock-up-in-green-khaki-texture-is-a-high-resolution-hat-mockup-to.jpg?s=612x612&w=0&k=20&c=v36a3Qg7ttnP2E3GmoMr-NODcsXgy3ekwX9fuldgwe8=',
      images: [
        'https://images.pexels.com/photos/20349911/pexels-photo-20349911/free-photo-of-grey-cap-on-a-white-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/20349912/pexels-photo-20349912/free-photo-of-back-of-a-grey-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/20349913/pexels-photo-20349913/free-photo-of-front-view-of-a-grey-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      category: 'truck'

    },
    {
      name: 'Truck Mesh White',
      price: 18.99,
      img: 'https://media.istockphoto.com/id/1184962940/photo/blank-plain-cap-hat-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RYDIZQyQFsFc4wnCiKSBHL6D7kXAa-hu_rAbx0g08qg=',
      images: [
        'https://images.pexels.com/photos/16843089/pexels-photo-16843089/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843094/pexels-photo-16843094/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843098/pexels-photo-16843098/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      category: 'truck'


    },
    {
      name: 'Truck White Logo',
      price: 19.49,
      img: 'https://www.alibaba.com/product-detail/Custom-Your-Design-Breathable-Mesh-Richardson_1601446130585.html?spm=a2700.galleryofferlist.p_offer.d_image.15ca13a0lxMQWY&priceId=c5dc1800ec214789b7d1a5045e85310d',
      images: [
        'https://images.pexels.com/photos/1184962940/pexels-photo-1184962940/free-photo-of-blank-plain-cap-hat-isolated-on-white-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843089/pexels-photo-16843089/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843094/pexels-photo-16843094/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843098/pexels-photo-16843098/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      category: 'truck'


    },
    {
      name: 'Truck White Strapback',
      price: 20.99,
      img: 'https://media.istockphoto.com/id/1163958328/photo/trucker-hat-or-mesh-cap-isolated.jpg?s=612x612&w=0&k=20&c=BzcqPaIauBYBmPlAF-D7HJV6EOUTEhNfjIkXTYUUSlE=',
      images: [
        'https://images.pexels.com/photos/16843089/pexels-photo-16843089/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843094/pexels-photo-16843094/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/16843098/pexels-photo-16843098/free-photo-of-a-man-with-a-white-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      category: 'truck'

    },
    {
      name: 'Truck Classic Black',
      price: 21.99,
      img: 'https://media.istockphoto.com/id/184351921/photo/baseball-trucker-cap.jpg?s=612x612&w=0&k=20&c=XvZl1rZPdfSVPO6APSHQpVSx65CECjTw01Qm-4j8Otk=',
      images: [
        'https://images.pexels.com/photos/17221290/pexels-photo-17221290/free-photo-of-man-in-white-t-shirt-wearing-a-black-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/20349880/pexels-photo-20349880/free-photo-of-black-cap-on-a-white-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/20349884/pexels-photo-20349884/free-photo-of-back-of-a-black-cap.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      category: 'truck'

    },
    {
      name: 'Truck Navy Foam',
      price: 19.99,
      img: 'https://media.istockphoto.com/id/1427572529/vector/blue-hip-hop-cap-with-mesh-four-panel-back-template.jpg?s=612x612&w=0&k=20&c=7T7-kVIz3wV6EFrr9wcAAyU8ZQx3ZSoxiGeE-0Nso-I=',
      images: [
        'https://images.pexels.com/photos/15989932/pexels-photo-15989932/free-photo-of-a-blue-baseball-cap-and-a-blue-shirt.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/15989931/pexels-photo-15989931/free-photo-of-a-blue-baseball-cap-and-a-blue-shirt.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/15989933/pexels-photo-15989933/free-photo-of-a-blue-baseball-cap-and-a-blue-shirt.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ],
      category: 'truck'

    },
  ]);

  getProductByName(name: string): Product | null {
    const allProducts = [...this.classic(), ...this.snapback(), ...this.truck()];
    return allProducts.find((p) => p.name === name) || null;
  }
}