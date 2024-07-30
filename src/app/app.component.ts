import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    isDarkTheme: boolean;

    constructor(private primengConfig: PrimeNGConfig) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.initializeTheme();
    }

    initializeTheme() {
        const theme = localStorage.getItem('theme');
        if(theme === "theme-dark"){
            this.isDarkTheme = true;
        }
        else {
            this.isDarkTheme = false;
        }
        if (theme) {
            this.changeTheme(theme);
        }
    }

    changeTheme(theme: string) {
        const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
        if(themeLink) {
            themeLink.href = '/assets/layout/styles/theme/' + theme + '/' + theme + '.css'
        }
        localStorage.setItem('theme', theme);
    }
}
