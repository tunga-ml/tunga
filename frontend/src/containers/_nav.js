import translate from '../services/i18n/Translate';
export default [

  {
    _tag: 'CSidebarNavTitle',
    _children: ['Tunga']
  },
  {
    _tag: 'CSidebarNavItem',
    name: translate.translate("nav.my_datasets"),
    to: '/datasets',
    icon: 'cil-puzzle',
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: translate.translate("nav.data_ret.data_retrieval"),
    route: '/retrieval',
    icon: 'cil-cloud-download',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: translate.translate("nav.data_ret.import_from_local"),
        to: '/retrieval/local',
      },
      {
        _tag: 'CSidebarNavItem',
        name: translate.translate("nav.data_ret.import_from_url"),
        to: '/retrieval/url',
      },
      {
        _tag: 'CSidebarNavItem',
        name: translate.translate("nav.data_ret.import_from_twitter"),
        to: '/retrieval/twitter',
      },
      //{
      //  _tag: 'CSidebarNavItem',
      //  name: translate.translate("nav.data_ret.import_from_api"),
      //  to: '/retrieval/api',
      //},
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: translate.translate("nav.preprocessing"),
    to: '/preprocessing',
    icon: 'cil-cursor',
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: translate.translate("nav.machine_learning"),
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Duygu Durum Analizi',
        to: '/ml/sentiment',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Konu Modelleme',
        to: '/ml/topic-modelling',

      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Anahtar Kelime Çıkarımı',
        to: '/ml/keyword-extraction',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Varlık Adı Tanımlama',
        to: '/ml/ner',
      },

      {
        _tag: 'CSidebarNavItem',
        name: 'Dil Tespiti',
        to: '/ml/language-identification',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Türkçe-İngilizce Çeviri',
        to: '/ml/translation',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Metin Özetleme',
        to: '/ml/summarization',
      },
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Veri Görselleştirme',
    to: '/visualization',
    icon: 'cil-chart-pie',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Sistem Değişkenleri',
    to: '/configuration',
    icon: 'cil-settings',
  },
  /*
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Theme']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Colors',
    to: '/theme/colors',
    icon: 'cil-drop',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Components']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Base',
    route: '/base',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Breadcrumb',
        to: '/base/breadcrumbs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Cards',
        to: '/base/cards',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Carousel',
        to: '/base/carousels',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Collapse',
        to: '/base/collapses',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Forms',
        to: '/base/forms',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Jumbotron',
        to: '/base/jumbotrons',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'List group',
        to: '/base/list-groups',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Navs',
        to: '/base/navs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Navbars',
        to: '/base/navbars',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Pagination',
        to: '/base/paginations',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Popovers',
        to: '/base/popovers',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Progress',
        to: '/base/progress-bar',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Switches',
        to: '/base/switches',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tables',
        to: '/base/tables',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tabs',
        to: '/base/tabs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tooltips',
        to: '/base/tooltips',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Buttons',
    route: '/buttons',
    icon: 'cil-cursor',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Buttons',
        to: '/buttons/buttons',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Brand buttons',
        to: '/buttons/brand-buttons',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Buttons groups',
        to: '/buttons/button-groups',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Dropdowns',
        to: '/buttons/button-dropdowns',
      }
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Charts',
    to: '/charts',
    icon: 'cil-chart-pie'
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Icons',
    route: '/icons',
    icon: 'cil-star',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'CoreUI Free',
        to: '/icons/coreui-icons',
        badge: {
          color: 'success',
          text: 'NEW',
        },
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'CoreUI Flags',
        to: '/icons/flags',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'CoreUI Brands',
        to: '/icons/brands',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Notifications',
    route: '/notifications',
    icon: 'cil-bell',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Modal',
        to: '/notifications/modals',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Toaster',
        to: '/notifications/toaster'
      }
    ]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Widgets',
    to: '/widgets',
    icon: 'cil-calculator',
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    _tag: 'CSidebarNavDivider'
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Labels']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Label danger',
    to: '',
    icon: {
      name: 'cil-star',
      className: 'text-danger'
    },
    label: true
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Label info',
    to: '',
    icon: {
      name: 'cil-star',
      className: 'text-info'
    },
    label: true
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Label warning',
    to: '',
    icon: {
      name: 'cil-star',
      className: 'text-warning'
    },
    label: true
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  }
    {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'info',
      text: 'NEW',
    }
  },
  */

  
]

