exports.handler = async (event: { Records: any[]; }) => {
    event.Records.forEach((record: any) => {
      console.log('Event: %j', record);
    });
  };