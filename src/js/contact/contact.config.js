function ContactConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
    .state('app.contact', {
      url: '/contact',
      controller: 'ContactCtrl',
      controllerAs: 'vm',
      templateUrl: 'contact/contact.view.html',
      title: 'Contact'
    });
  
  };
  
  export default ContactConfig;
  