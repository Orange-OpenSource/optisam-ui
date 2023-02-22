export type MenuItemMat = {
  id: string;
  matTooltip: string;
  routerLink: string;
  menuItemName: string;
  auth: string[];
  isMatIcon: true;
  matIconName: string;
};
export type MenuItemImg = {
  id: string;
  matTooltip: string;
  routerLink: string;
  menuItemName: string;
  auth: string[];
  isMatIcon: false;
  imgSrc: string;
  imgStyle?: string;
};
