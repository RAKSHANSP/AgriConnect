import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Signup } from './signup/signup';
import { Login} from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { WeatherComponent } from './weather/weather';
import { ProductComponent } from './product/product';
import { DealerMarketComponent } from './dealer-market/dealer-market';
import { InformationSharingComponent } from './information-sharing/information-sharing';
import { GovtOfficialComponent } from './govt-official/govt-official';
import { IndividualChatComponent } from './individual-chat/individual-chat';
import { GroupChatComponent } from './group-chat/group-chat';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'weather', component: WeatherComponent },
  { path: 'products', component: ProductComponent },
  { path: 'dealer-market', component: DealerMarketComponent },
  { path: 'information-sharing', component: InformationSharingComponent },
  { path: 'govt-official', component: GovtOfficialComponent },
  { path: 'individual-chat', component: IndividualChatComponent },
  { path: 'group-chat', component: GroupChatComponent },
];