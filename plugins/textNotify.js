exports.default = {
  type: 'defaultTodo',
  label: 'default',
  schema: {
    text: '',
    time: '',
  },
  script: (data, win) => {
    win.notifier.notify(
      {
        title: data.text,
        message: '这里是默认插件的信息，可以通过点击修改标题来修改数据哦',
        sound: true, // Only Notification Center or Windows Toasters
        wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
        actions: ['changetitle', 'finish', 'close'],
      },
      function (err, response) {
        if (response === 'changetitle') {
          data.text = 'Notification';
        }
        if (response === 'finish') {
          data.checked = true;
        }
        console.log(err);
      }
    );
    // setInterval(() => {
    //   if (win.dayjs().unix() === data.time && !data.checked) {
    //     win.notifier.notify(
    //       {
    //         title: data.text,
    //         message: '这里是默认插件的信息，可以通过点击修改标题来修改数据哦',
    //         sound: true, // Only Notification Center or Windows Toasters
    //         wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    //         actions: ['changeTitle', 'finish', 'close'],
    //       },
    //       function (err, response) {
    //         if (response === 'changeTitle') {
    //           data.text = 'Notification';
    //         }
    //         if (response === 'finish') {
    //           data.checked = true;
    //         }
    //       }
    //     );
    //     win.notifier.on('click', function (notifierObject, options, event) {
    //       console.log('222', notifierObject, options, event);
    //     });
    //   }
    // }, 1000);
  },
};
