( function() {
    "use strict";

    var CasseBrique;

    CasseBrique = function( oApp ) {

        var game = this, // eslint-disable-line consistent-this
            dX = 12,
            dY = 10,
            aBriques = new Array(),
            iBriques = 0,
            ctx,
            i,
            j,
            gamePhase = 1,
            lifes = 3,
            gameDifficulty = 0,
            iEcart = 5;

        this.app = oApp;
        ctx = this.app.context;

        // barre de jeu
        this.bar = {
            "sizeX": 75,
            "sizeY":12,
            "posX": this.app.width / 2,
            "posY": this.app.height - 5,
            "speed": 25,
            "positionMouse": this.app.width / 2,
            

            "draw":function(){
                //dessine la barre
                ctx.strokeStyle = "white";
                ctx.fillStyle = "red";
                ctx.strokeRect( this.posX - this.sizeX / 2, this.posY - this.sizeY, this.sizeX, this.sizeY );
                ctx.fillRect( this.posX - this.sizeX / 2, this.posY - this.sizeY, this.sizeX, this.sizeY );
                
            },
            "update":function( oEvent ) {
                //informations sur la position de la souris
                
                var oCanvasRect = oApp.canvas.getBoundingClientRect();
                //var iPosition = this.posX;
                
                    
                if ( oEvent ) {
                    if ( !game.ended ){
                                if( oEvent.type === "keydown" ) { // déplacement au clavier
                                    
                                        if ( oEvent.keyCode === 37 ) { //left
                                            this.posX -= this.speed;
                                            this.positionMouse = this.posX;
                                        }
                                        else if ( oEvent.keyCode === 39 ) { //right
                                            this.posX += this.speed;
                                            this.positionMouse = this.posX;
                                        }
                                        else {
                                            return;
                                        }
                                 
                                 }
                                else if ( oEvent.type === "mousemove" ) { // déplacement à la souris
                                    
                                     this.positionMouse = oEvent.clientX - oCanvasRect.left;
                                     //console.log( game.ended );
                                    
                                }
                                
                                else {
                                    return;
                                }
                            }
                        }
 

                ( this.positionMouse != this.posX ) && ( this.posX += ( this.positionMouse - this.posX ) / this.speed );
                     //la barre ne peut pas dépasser les bords du canvas

                ( this.posX < this.sizeX / 2 ) && ( this.posX = this.sizeX / 2 );
                ( this.posX > oApp.width - this.sizeX / 2 ) && ( this.posX = oApp.width - this.sizeX / 2 );
                if( !game.ended ) {
                    this.draw();
                }
                
            }
        };
        //balle
        this.ball = { 
            "random": Math.random(),
            "radius":6,
            "posX": 100,
            "posY": 300,               
            "verticalSpeed":4,
            "horizontalSpeed":4,

            "collide":function( rect ){

                var upperSide = rect.posY - rect.sizeY,
                    leftSide = rect.posX - rect.sizeX / 2,
                    rightSide = rect.posX + rect.sizeX / 2,
                    downSide = rect.posY,
                    x1 = this.posX - leftSide,
                    x2 = this.posX - rightSide,
                    y1 = this.posY - upperSide,
                    y2 = this.posY - downSide,
                    dist1 = Math.sqrt(x1 * x1 + y1 * y1), // upper left
                    dist2 = Math.sqrt(x2 * x2 + y1 * y1), // upper right
                    dist3 = Math.sqrt(x1 * x1 + y2 * y2), // down left
                    dist4 = Math.sqrt(x2 * x2 + y2 * y2), // down right
                    collision = false;

                //collision par les côtés
                if ( upperSide <= this.posY && this.posY <= downSide ) {
                    
                    if ( leftSide <= this.posX + this.radius && this.posX - this.radius <= rightSide ) {
                        this.horizontalSpeed = -this.horizontalSpeed;
                        collision = true;
                    }
                }
                //collision par le haut et bas
                if ( leftSide <= this.posX && this.posX <= rightSide ) {
                    if ( upperSide <= this.posY + this.radius && this.posY - this.radius <= downSide ) {
                        this.verticalSpeed = -this.verticalSpeed;
                        collision = true;
                        if ( this.posY + this.radius / 2 > upperSide && downSide - 1 > this.posY ) {
                            this.posY = upperSide - this.radius + 0.1;
                        }
                        if ( this.posY - this.radius / 2 < downSide && upperSide + 1 < this.posY ) {
                            this.posY = downSide + this.radius + 0.1 ;
                        }
                    }
                        
                }
                //collision des coins
                if ( dist1 < this.radius || dist2 < this.radius || dist3 < this.radius || dist4 < this.radius ) {
                    this.verticalSpeed = -this.verticalSpeed;
                    collision = true;
                }
                //vérifier si collision a eu lieu
                return collision;         
            },
            "draw" : function() {

                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc( this.posX, this.posY, this.radius, 0, Math.PI * 2 );
                ctx.closePath();
                ctx.fill();
            },
            "update" : function( oEvent ) {
                 if ( oEvent ) {
                    if ( oEvent.type === "click" || ( oEvent.type === "keyup" && oEvent.keyCode === 32 ) ) {
                        if ( !game.ended ) {
                            if ( gamePhase === 1 ) {
                                gamePhase = 2;
                            }
                            else {
                                return;
                            }
                        }
                        else {
                            // restart game
                            return game.init();
                        }
                    }
                    else if ( oEvent.type === "keyup" ) {
                        if ( gamePhase === 0 ) {
                            switch ( oEvent.keyCode ) {
                                case 49:
                                case 97:
                                    gameDifficulty = 1;
                                    gamePhase = 1;
                                    lifes = 5;
                                    this.verticalSpeed = -3;
                                    dX = 5;
                                    break;
                                case 50:
                                case 98:
                                    gameDifficulty = 2;
                                    gamePhase = 1;
                                    lifes = 3;
                                    this.verticalSpeed = -5;
                                    dX = 10;
                                    break;
                                case 51:
                                case 99:
                                    gameDifficulty = 3;
                                    gamePhase = 1;
                                    lifes = 2;
                                    this.verticalSpeed = -7;
                                    dX = 12;
                                    break;
                            }

                        } else {
                            return;
                        }
                    }
                    else {
                        return;
                    }
                }
                //identifier la phase de jeu
                if ( gamePhase == 1 ) {
                    this.posX = game.bar.posX;
                    this.posY = game.bar.posY - game.bar.sizeY - this.radius -1 ;
                    this.horizontalSpeed = ( Math.random() * 4 ) - 2;
                }
                else if ( gamePhase == 2 ) {
                    
                    this.posY += this.verticalSpeed;
                    this.posX += this.horizontalSpeed;

                    //rebond sur les bords du canvas
                    ( this.posY - this.radius <= 0 ) && ( this.verticalSpeed = -this.verticalSpeed );
                    ( this.posX - this.radius <= 0 || this.posX + this.radius >= oApp.width ) && ( this.horizontalSpeed = -this.horizontalSpeed );

                    //gérer le game over

                     if ( this.posY + this.radius >= oApp.height ) {
                        if ( lifes > 1 ){
                            lifes--
                            gamePhase = 1;
                            
                        }
                        else {
                            lifes = 0;
                            game.over();
                        }
                     }

                    //this.collide( game.bar );
                    if ( this.collide( game.bar ) ) {
                        this.horizontalSpeed += ( Math.random() * 2 ) - 1;
                        if ( this.horizontalSpeed >= 6 ) {
                            this.horizontalSpeed -= 2;
                        }
                        if ( this.horizontalSpeed <= -6 ) {
                            this.horizontalSpeed += 2;
                        }

                    }
                }
                else {
                    return;
                }
                
                if ( !game.ended ){
                        this.draw();
                    }
            }
        };
        //briques
        this.bricks = {
            "sizeX": 75,
            "sizeY": 12,
            "posX": 0,
            "posY": 0,
            "color":[ "red","yellow","green","lightblue","cyan", "pink","magenta","lightgreen" ],
            "draw":function( e ){
                this.sizeX = oApp.width / dX - iEcart - 0.1;
                ctx.fillStyle = this.color[ e % 8 ];
                ctx.fillRect( this.posX - this.sizeX / 2, this.posY - this.sizeY, this.sizeX, this.sizeY );
            },
            "table":function(){

               for ( i = 0 ; i < dX ; i++ ) {
                    aBriques[ i ] = true;
                    for ( j = 0 ; j < dY ; j++ ) {
                        aBriques[ i ] = new Array()
                        
                        //aBriques[ i ][ j ] = true;
                        this.posY = ( 1 + j ) * ( iEcart + this.sizeY );
                        this.posX = iEcart + this.sizeX / 2 +  i * ( iEcart + this.sizeX );
 
                        this.draw( j );
                    }
                }
            },
            "update":function(){
                iBriques = 0;
               for ( i = 0 ; i < dX ; i++ ) {
                    for ( j = 0 ; j < dY ; j++ ) {

                        this.posY = ( 1 + j ) * ( iEcart + this.sizeY );
                        this.posX = iEcart + this.sizeX / 2 +  i * ( iEcart + this.sizeX );
                        if (  !aBriques[ i ][ j ] )
                        {
                            this.draw( j );
                            iBriques++
                            if ( game.ball.collide( this ) ) {
                                aBriques[ i ][ j ] = true;
                            }
                         }
                    }
                }
                if ( iBriques === 0 ) {
                    game.victoire();
                }
            }
        };
        //écran de victoire
        this.victoire = function() {
            this.ended = true;
            window.cancelAnimationFrame( this.animationRequestID );
            ctx.clearRect( 0, 0, this.app.width, this.app.height );
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.font = "20px Helvetica";
            ctx.fillText( "Vies : " + lifes, 10 , this.app.height - 20 );
            ctx.textAlign = "center";
            ctx.font = "25px Helvetica";
            ctx.fillText( "Bravo ! Vous avez gagné !", this.app.width / 2, this.app.height / 2.5 );
            ctx.fillText( "Cliquez ou appuyez sur Espace", this.app.width / 2, this.app.height / 2 );
            ctx.fillText( " pour recommencer", this.app.width / 2, this.app.height / 1.75 );
        };
        //écran de défaite
        this.over = function() {
            this.ended = true;
            window.cancelAnimationFrame( this.animationRequestID );
            ctx.clearRect( 0, 0, this.app.width, this.app.height );
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.font = "20px Helvetica";
            ctx.fillText( "Vies : " + lifes, 10 , this.app.height - 20 );
            ctx.textAlign = "center";
            ctx.font = "25px Helvetica";
            ctx.fillText( "Dommage ! Vous avez perdu !", this.app.width / 2, this.app.height / 3.2 );
            ctx.fillText( "Briques restantes : " + iBriques, this.app.width / 2, this.app.height / 2.5 );
            ctx.fillText( "Cliquez ou appuyez sur Espace", this.app.width / 2, this.app.height / 1.75 );
            ctx.fillText( " pour recommencer", this.app.width / 2, this.app.height / 1.6 );
            
        }
        this.start = function() {
            ctx.textAlign = "center";
            ctx.font = "25px Helvetica";
            ctx.fillStyle = "white";
            ctx.fillText( "1. Appuyez sur 1, 2 ou 3 pour choisir la difficulté", this.app.width / 2, this.app.height / 4 );
            ctx.fillText( "2. Ensuite, cliquez ou appuyez sur Espace", this.app.width / 2, this.app.height / 2.25 );
            ctx.fillText( " pour lancer la balle", this.app.width / 2, this.app.height / 2 );
            ctx.fillText( "3. Utilisez la souris ou les flèches gauche et droite", this.app.width / 2, this.app.height / 1.5 );
            ctx.fillText( "pour vous déplacer", this.app.width / 2, this.app.height / 1.35 );
        }
        this.animate = function() {

           
            this.animationRequestID = window.requestAnimationFrame( this.animate.bind( this ) );
            
            //clear rect
            ctx.clearRect( 0, 0, this.app.width, this.app.height );
            if( gamePhase === 0 ) {
                this.start();
            }
            if( gamePhase != 0 && !this.ended ) {
                //vies
                ctx.textAlign = "left";
                ctx.fillStyle = "white";
                ctx.font = "20px Helvetica";
                ctx.fillText( "Vies : " + lifes, 10 , this.app.height - 20 );

                //difficulté
                ctx.textAlign = "right";
                ctx.fillStyle = "white";
                ctx.font = "20px Helvetica";
                ctx.fillText( "difficulté : " + gameDifficulty, this.app.width - 10 , this.app.height - 20 );

                //briques
                this.bricks.update();
                
                //balle
                this.ball.update();
                //barre 
                this.bar.update();
                }
            };
            
        this.init = function() {
            if ( !this.eventsSetted ) {
                    this.app.canvas.addEventListener( "click", this.ball.update.bind( this.ball ) );
                    window.addEventListener( "keyup", this.ball.update.bind( this.ball ) );
                    this.app.canvas.addEventListener( "mousemove", this.bar.update.bind( this.bar ) );  
                    window.addEventListener( "keydown", this.bar.update.bind( this.bar ) );
                
                this.eventsSetted = true;
            }
            gamePhase = 0;
            this.ball.posY = 300;
            this.ended = false;
            this.bricks.table();
            this.animate();
        };
        this.init();
    }

    window.CasseBrique = CasseBrique;

})();