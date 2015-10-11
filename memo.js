var MemoBoard = React.createClass({
  getInitialState: function() {
    return (
      {items: []}
    );
  },
  render: function() {
    var height = this.props.height;
    var menuHeight = 50;
    var containerHeight = height - menuHeight;

    return (
      <div>
        <MemoMenu height={menuHeight} addItem={this.addItem} />
        <MemoContainer height={containerHeight} items={this.state.items} removeItem={this.removeItem} />
      </div>
    );
  },
  addItem: function(item) {

    this.itemObject[item.id] = item;
    this.refreshItem();
  },
  removeItem: function(id) {

    delete this.itemObject[id];
    this.refreshItem();
  },
  refreshItem: function() {
    var items = [];
    for(var key in this.itemObject) {

      items.push(this.itemObject[key]);
    }

    var state = {
      items: items
    };
    this.setState(state);
  },
  itemObject: {}
});

var MemoMenu = React.createClass({
  getInitialState: function() {
    return { id : 0 }
  },
  render: function() {

    var style = {
      height: this.props.height,
      margin: '0'
    };

    return (
      <nav className="navbar navbar-default" style={style}>
        <div className="container-fluid">
          <div className="navbar-header">
              <a className="navbar-brand" href="#">memo</a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li><a href="#" onClick={this.addItem}>메모추가</a></li>
          </ul>
        </div>
      </nav>

    );
  },
  addItem: function(e) {

    e.preventDefault();

    var id = this.state.id + 1;
    this.props.addItem({ id: id });
    this.setState({ id : id });
  }
});

var MemoContainer = React.createClass({

  selectedItemId: null,
  zIndex: 0,

  selectItem: function(item) {
    if(this.selectedItemId != item.state.id) {
      this.selectedItemId = item.state.id;
      $(item.getDOMNode()).css('z-index', ++this.zIndex);
    }
  },

  removeItem: function(id) {
    this.props.removeItem(id);
  },

  render: function() {

    var style = {
      height: this.props.height
    };

    var self = this;
    var items = this.props.items.map(function(item, i) {
      return <MemoItem key={item.id} item={item} onFocus={self.selectItem} onRemove={self.removeItem} />;
    });

    return (
      <div className="memo-container" style={style}>{items}</div>
    );
  }
});

var MemoItem = React.createClass({

  getInitialState: function() {
    return {
      visible: true,
      height: 200,
      width: 200,
      msg: ''
    };
  },

  render: function() {

    var minimize = this.state.visible ? 'fa fa-compress' : 'fa fa-expand';
    var bodyDisplay = this.state.visible ? 'block' : 'none';

    var itemStyle = {
      'height': this.state.height,
      'width': this.state.width,
      'display': 'inline-block',
      'position': 'absolute',
      'overflow': 'hidden'
    };
    var titleContainerStyle = {
      'cursor': 'move'
    };
    var titleMsgStyle = {
      'paddingTop': '7.5px',
      'width': this.state.titleWidth
    };
    var bodyStyle = {
      'width': '100%',
      'height': this.state.height - 80,
      'display': bodyDisplay,
      'resize': 'none',
      'border': 'none',
      'overflow':'auto',
      'WebkitBoxSizing': 'border-box',
      'MozBoxSizing': 'border-box',
      'boxSizing': 'border-box',
      'backgroundColor': 'transparent'
    };
    var gripStyle = {
      'display': bodyDisplay
    };

    return (
      <div className="panel panel-primary" style={itemStyle} onMouseDown={this.selectItem}>
        <div ref="titleContainer" className="panel-heading clearfix title" style={titleContainerStyle} onDoubleClick={this.toggleBody}>
          <div ref="titleMsg" className="panel-title pull-left titleMsg" style={titleMsgStyle}>{this.state.msg}</div>
          <div ref="titleBtns" className="btn-group pull-right">
            <a href="#s" className="btn btn-default btn-sm" onClick={this.toggleBody}><i className={minimize}></i></a>
            <a href="#x" className="btn btn-default btn-sm" onClick={this.remove}><i className="fa fa-times"></i></a>
          </div>
        </div>
        <div className="panel-body">
          <textarea ref="bodyText" style={bodyStyle} placeholder="메모를 작성해 주세요.">{this.state.text}</textarea>
        </div>
        <div className="ui-resizable-handle ui-resizable-se segrip" style={gripStyle}></div>
      </div>
    );
  },

  componentWillMount: function() {

    this.setState({
      id: this.props.item.id,
      text: this.props.item.text
    });
  },

  componentWillReceiveProps: function(nextProps) {

    this.setState({
      id: nextProps.item.id,
      text: nextProps.item.text
    });
  },

  componentDidMount: function() {

    var self = this;

    $(this.getDOMNode())
      .draggable({ containment: 'parent', handle: 'div.title' })
      .resizable({
        containment: 'parent',
        minWidth: 150,
        minHeight: 150,
        handles: { se: '.segrip' },
        ghost: true,
        stop: function(event, ui) {
          $el = $(ui.element);
          self.setState({ width: $el.width(), height: $el.height() });
        }
    });
  },

  selectItem: function() {
    this.props.onFocus(this);
  },

  remove: function(e) {
    e.preventDefault();
    this.props.onRemove(this.state.id);
  },

  toggleBody: function(e) {

    e.preventDefault();

    var visible = !this.state.visible;
    var msg = visible ? ''
      : this.refs.bodyText.getDOMNode().value.split('\n')[0];
    var beforeHeight = visible ? null
      : this.state.height;
    var height = visible ? this.state.beforeHeight : $(this.refs.titleContainer.getDOMNode()).outerHeight();
    var titleWidth = visible ? this.state.beforeTitleWidth : $(this.refs.titleContainer.getDOMNode()).width() - $(this.refs.titleBtns.getDOMNode()).width();

    this.setState({
      beforeHeight: beforeHeight,
      height: height,
      titleWidth: titleWidth,
      visible: visible,
      msg: msg
    });
  }
});

var height = $(window).height();
React.render(
  <MemoBoard height={height} />,
  document.body
);
