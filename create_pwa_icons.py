from PIL import Image, ImageDraw
import os

def create_icon(size, is_maskable=False):
    """Crear un icono PNG para PWA"""
    
    # Colores
    if is_maskable:
        # Maskable: icono con margen de seguridad
        bg_color = (59, 130, 246)  # Azul #3b82f6
        margin = int(size * 0.15)  # 15% de margen
        icon_size = size - (margin * 2)
    else:
        bg_color = (15, 23, 42)  # Gris oscuro #0f172a
        margin = int(size * 0.1)
        icon_size = size - (margin * 2)
    
    # Crear imagen
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Fondo
    if is_maskable:
        draw.rectangle([0, 0, size, size], fill=bg_color)
    else:
        # Gradiente simulado con rectángulos
        for i in range(size):
            color_value = int(59 + (15 - 59) * (i / size))
            draw.rectangle(
                [0, i, size, i + 1],
                fill=(color_value, int(130 + (23 - 130) * (i / size)), 246)
            )
    
    # Dibujar dumbbells (icono de fitness)
    center_x = size // 2
    center_y = size // 2
    
    # Tamaño del dumbbbell
    db_height = icon_size // 2
    db_width = icon_size // 3
    
    # Color del icono (blanco o contraste)
    icon_color = (255, 255, 255) if is_maskable else (59, 130, 246)
    
    # Barra central del dumbbbell
    bar_width = db_width // 3
    draw.rectangle(
        [center_x - bar_width // 2, center_y - db_height // 2,
         center_x + bar_width // 2, center_y + db_height // 2],
        fill=icon_color
    )
    
    # Disco izquierdo
    disk_size = db_width // 2
    draw.ellipse(
        [center_x - bar_width // 2 - disk_size, center_y - disk_size,
         center_x - bar_width // 2 + disk_size, center_y + disk_size],
        fill=icon_color
    )
    
    # Disco derecho
    draw.ellipse(
        [center_x + bar_width // 2 - disk_size, center_y - disk_size,
         center_x + bar_width // 2 + disk_size, center_y + disk_size],
        fill=icon_color
    )
    
    return img

def main():
    # Crear directorio public si no existe
    os.makedirs('public', exist_ok=True)
    
    # Crear iconos
    print("Creando iconos PWA...")
    
    # 192x192
    icon_192 = create_icon(192, is_maskable=False)
    icon_192.save('public/icon-192.png')
    print("✓ public/icon-192.png (192x192)")
    
    # 512x512
    icon_512 = create_icon(512, is_maskable=False)
    icon_512.save('public/icon-512.png')
    print("✓ public/icon-512.png (512x512)")
    
    # 192x192 maskable
    icon_192_maskable = create_icon(192, is_maskable=True)
    icon_192_maskable.save('public/icon-192-maskable.png')
    print("✓ public/icon-192-maskable.png (192x192)")
    
    # 512x512 maskable
    icon_512_maskable = create_icon(512, is_maskable=True)
    icon_512_maskable.save('public/icon-512-maskable.png')
    print("✓ public/icon-512-maskable.png (512x512)")
    
    print("\n✓ Todos los iconos han sido creados exitosamente")

if __name__ == '__main__':
    main()