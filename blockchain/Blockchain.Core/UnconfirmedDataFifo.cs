﻿using Blockchain.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Blockchain
{
    public class UnconfirmedDataFifo : IFifoQueue
    {
        private readonly IList<object> _datas;

        public UnconfirmedDataFifo()
        {
            _datas = new List<object>();
        }

        public void AddData(object data)
        {
            _datas.Add(data);
        }

        public object GetAndRemoveData()
        {
            object data = null;

            if (_datas.Count > 0)
            {
                data = _datas.ElementAt(0);
                _datas.RemoveAt(0);
            }

            return data;
        }
    }
}
